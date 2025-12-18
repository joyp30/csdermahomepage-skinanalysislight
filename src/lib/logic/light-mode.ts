import { TREATMENTS, Treatment } from '../data/treatments';

export interface LightAnswers {
    concerns: string[]; // e.g., ['pigmentation', 'acne']
    skinType: string; // 'dry', 'oily', 'sensitive', 'normal'

    // Dynamic Answers (Optional, populated based on flow)
    pigment_visual?: 'melasma' | 'freckle' | 'pih' | 'dullness'; // Visual Anchor
    pigment_downtime?: 'immediate' | 'social' | 'strict'; // Downtime Tolerance

    acne_uv_risk?: boolean; // Outdoor plans?
    acne_value?: 'economy' | 'convenience'; // Budget vs Convenience

    lifting_type?: 'sagging' | 'thin' | 'fat'; // Anatomy
    pain_tolerance?: 'sensitive' | 'normal';
}

export interface RecommendationResult {
    main: Treatment;
    upsell?: Treatment;
    package_info?: string;
    script: string; // The "Sommelier" rationale
}

export function getLightRecommendation(answers: LightAnswers): RecommendationResult | null {
    const { concerns } = answers;
    let mainSku: string | undefined;
    let upsellSku: string | undefined;
    let script = "";

    // Priority Order: Pigmentation > Acne > Lifting > Redness
    // (This priority can be adjusted or user-selected primary concern)

    // --- MODULE I: PIGMENTATION ---
    if (concerns.includes('pigmentation')) {
        // Step 1: Visual Anchor
        if (answers.pigment_visual === 'melasma' || answers.pigment_visual === 'dullness' || !answers.pigment_visual) {
            // Melasma path: Conservative Toning
            if (answers.skinType === 'dry') {
                mainSku = '1-1'; // Mono Toning (Basic) -> Upgrade to 1-3 based on Upsell? 
                // Actually logic doc says: Dry -> Shining Mono Toning (Not in DB yet? Use Dual Toning 1-3 as proxy for now)
                mainSku = '1-3';
                script = "건조한 기미 피부에는 수분과 기미 억제 효과가 동시에 필요한 듀얼 토닝이 적합합니다.";
            } else {
                mainSku = '1-5'; // Triple Toning
                script = "기미는 강한 자극보다 부드럽게 색소를 잘게 부수어 배출시키는 트리플 토닝이 가장 효과적입니다.";
            }
            upsellSku = '19-2'; // LDM
        } else if (answers.pigment_visual === 'freckle') {
            // Freckle path: Downtime check
            if (answers.pigment_downtime === 'strict') {
                mainSku = '2-5'; // Blemish Premium (Tape)
                script = "경계가 뚜렷한 잡티는 확실하게 제거해야 합니다. 듀오덤 부착이 가능하시다면 프리미엄 잡티 제거를 추천드립니다.";
            } else if (answers.pigment_downtime === 'social') {
                mainSku = '2-1'; // Lavieen
                script = "테이프는 부담스럽지만 확실한 효과를 원하신다면, 딱지 없이 톤업이 가능한 라비앙 레이저가 최적입니다.";
            } else {
                mainSku = '1-3'; // Dual Toning (Immediate)
                script = "일상생활 지장 없이 서서히 옅어지게 하려면 듀얼 토닝으로 꾸준히 관리하는 것이 좋습니다.";
            }
            upsellSku = '16-1'; // Cryo
        } else if (answers.pigment_visual === 'pih') {
            mainSku = '4-2'; // Redness + Pigment
            script = "여드름 자국은 붉은기와 색소가 섞여 있어, 혈관 레이저와 토닝을 결합한 복합 치료가 필요합니다.";
            upsellSku = '19-2'; // LDM
        }
    }

    // --- MODULE II: ACNE ---
    else if (concerns.includes('acne')) {
        if (answers.acne_uv_risk) {
            mainSku = '5-13'; // Gold PTT (Safe)
            script = "야외 활동 계획이 있으시군요. 자외선 부작용 걱정 없는 골드 PTT로 안전하게 여드름 원인을 제거해 드립니다.";
        } else {
            if (answers.acne_value === 'economy') {
                mainSku = '5-10'; // Mild PDT
                script = "가성비가 뛰어난 마일드 PDT를 추천합니다. 시술 후 2일간은 자외선 차단에 신경 써주셔야 합니다.";
            } else {
                mainSku = '5-11'; // Green PDT
                script = "일상생활과 치료 효과의 균형이 가장 좋은 그린 PDT를 추천합니다.";
            }
        }
        upsellSku = '16-1'; // Cryo
    }

    // --- MODULE III: LIFTING ---
    else if (concerns.includes('wrinkles') || concerns.includes('sagging')) {
        const type = answers.lifting_type || 'sagging';
        if (type === 'sagging') {
            mainSku = '8-1'; // V-Ro
            script = "무너진 턱선과 처짐을 개선하기 위해서는 근막층까지 도달하는 브이로 어드밴스가 필요합니다.";
        } else if (type === 'thin') {
            mainSku = '8-6'; // Oligio
            script = "피부가 얇고 잔주름이 고민이시라면, 진피층을 쫀쫀하게 채워주는 올리지오가 정답입니다.";
        } else if (type === 'fat') {
            mainSku = '8-21'; // Elsa
            script = "단순 처짐이 아니라 불필요한 지방이 원인이라면, 지방 분해 효과가 있는 엘사 리프팅이 효과적입니다.";
        }

        // Pain Upsell
        if (answers.pain_tolerance === 'sensitive') {
            // Logic for sensitive pain? Maybe recommend sedation (not in scope) or emphasize comfort.
            // Or upsell LDM for soothing.
            upsellSku = '19-2';
        } else {
            upsellSku = '8-7'; // Double Up if not already selected? Or upsell mask?
        }

        // Upsell Logic Overrides
        if (mainSku === '8-1' || mainSku === '8-6') {
            upsellSku = '19-2'; // LDM is standard attach
        }
    }

    // --- MODULE IV: REDNESS ---
    else if (concerns.includes('redness')) {
        if (concerns.includes('acne')) {
            mainSku = '4-2'; // Acne Redness
            script = "여드름과 동반된 붉은기는 염증과 혈관을 동시에 잡아야 합니다.";
        } else {
            mainSku = 'synergy_flush';
            script = "안면 홍조 개선을 위한 혈관 전용 레이저 치료를 추천합니다.";
        }
        upsellSku = '19-2'; // LDM
    }

    // Default Fallback
    if (!mainSku) {
        mainSku = '19-2'; // LDM default
        script = "피부 컨디션 회복을 위한 고보습 재생 관리부터 시작해보세요.";
    }

    // Fetch Objects
    const mainTreatment = TREATMENTS.find(t => t.sku_id === mainSku || t.id === mainSku);
    const upsellTreatment = upsellSku ? TREATMENTS.find(t => t.sku_id === upsellSku) : undefined;

    if (!mainTreatment) return null;

    return {
        main: mainTreatment,
        upsell: upsellTreatment,
        package_info: "5회 패키지 결제 시 1회당 20% 할인 혜택",
        script
    };
}
