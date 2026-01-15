import { TREATMENTS } from '../data/treatments';
import type { Treatment } from '../data/treatments';

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

    // --- MODULE I: PIGMENTATION ---
    if (concerns.includes('pigmentation')) {
        // Default Logic without Deep Dive
        if (answers.skinType === 'dry' || answers.skinType === 'sensitive') {
            mainSku = '1-3'; // Dual Toning
            script = "건조하고 민감한 색소 피부에는 자극 없이 수분과 기미 억제 효과를 동시에 주는 듀얼 토닝이 가장 적합합니다.";
        } else {
            mainSku = '1-5'; // Triple Toning
            script = "색소 침착을 효과적으로 개선하기 위해, 3가지 레이저 파장을 이용해 색소를 잘게 부수어 배출시키는 트리플 토닝을 추천합니다.";
        }
        upsellSku = '19-2'; // LDM
    }

    // --- MODULE II: ACNE ---
    else if (concerns.includes('acne')) {
        // Default to milder/general options
        if (answers.skinType === 'sensitive') {
            mainSku = '5-10'; // Mild PDT
            script = "민감한 여드름 피부에는 자극을 최소화하면서 피지선을 조절하는 마일드 PDT 관리가 효과적입니다.";
        } else {
            mainSku = '5-10b'; // Green PDT
            script = "일상생활 지장 없이 여드름의 원인인 피지선과 여드름 균을 동시에 억제하는 그린 PDT를 추천해 드립니다.";
        }
        upsellSku = '16-1'; // Cryo
    }

    // --- MODULE III: LIFTING ---
    else if (concerns.includes('wrinkles') || concerns.includes('sagging')) {
        if (answers.skinType === 'oily' || answers.skinType === 'combination') {
            // Heavier skin / sagging tendency
            mainSku = '8-1'; // V-Ro
            script = "무너진 턱선과 처짐을 개선하고 탄력 있는 V라인을 만들기 위해 근막층까지 작용하는 브이로 리프팅을 추천합니다.";
        } else {
            // Dry/Thin skin -> Oligio
            mainSku = '8-6'; // Oligio
            script = "피부 진피층에 고주파 에너지를 전달하여 콜라겐 생성을 촉진하고, 잔주름과 탄력을 개선하는 올리지오가 적합합니다.";
        }
        upsellSku = '19-2'; // LDM
    }

    // --- MODULE IV: REDNESS ---
    else if (concerns.includes('redness')) {
        mainSku = '4-6'; // Synergy
        script = "붉은기와 안면 홍조를 개선하기 위해 확장된 혈관만을 선택적으로 치료하는 시너지 레이저가 가장 효과적입니다.";
        upsellSku = '19-2'; // LDM
    }

    // --- MODULE V: PORES ---
    else if (concerns.includes('pores')) {
        mainSku = '5-1'; // Aqua Peel (Basic pore care)
        script = "모공 속 노폐물을 정리하고 피부결을 개선하는 것이 중요합니다. 자극 없는 아쿠아필 관리를 먼저 시작해보세요.";
        upsellSku = '5-2'; // Pico Fraxel for more aggressive
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
