import { TREATMENTS } from '../data/treatments';
import type { Treatment } from '../data/treatments';

export interface LightAnswers {
    concerns: string[]; // e.g., ['pigmentation', 'acne']
    skinType: string; // 'dry', 'oily', 'sensitive', 'normal'
    budget: string; // 'economy' | 'standard' | 'premium'

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
    script: string;
}

// ----------------------------------------------------------------------
// Logic Implementation
// ----------------------------------------------------------------------

export function getLightRecommendation(answers: LightAnswers): RecommendationResult {
    const { concerns, budget, skinType } = answers;
    const concern = concerns[0] || 'pigmentation'; // Default to first concern

    // Helper to find treatment by ID
    const getTx = (id: string) => TREATMENTS.find(t => t.id === id);

    let mainTx: Treatment | undefined;
    let upsellTx: Treatment | undefined;
    let script = "";

    // --- Logic based on Concern & Budget ---
    // Restricted to treatments found in "Treatment Program (26.1.12)" Excel file.

    if (concern === 'pigmentation') {
        if (budget === 'economy') {
            mainTx = getTx('mono_toning');
            script = "기본적인 톤 개선을 위해, 합리적인 가격의 모노 토닝을 추천합니다.";
        } else if (budget === 'standard') {
            mainTx = getTx('dual_toning');
            script = "미백 효과를 높이기 위해 비타민 침투가 포함된 듀얼 토닝을 추천합니다.";
        } else {
            mainTx = getTx('triple_toning');
            script = "복합적인 색소 문제 해결을 위해 3가지 레이저를 사용하는 트리플 토닝이 효과적입니다.";
        }
        upsellTx = getTx('cryo');
    }

    else if (concern === 'redness') {
        // Only Synergy & Redness Acne found in allowed list
        mainTx = getTx('synergy_flush');
        if (budget === 'economy') {
            // If economy, maybe recommend simple care or just explain Synergy is best
            script = "홍조 치료에는 혈관 전용 레이저인 시너지 레이저가 가장 효과적입니다.";
        } else {
            script = "안면 홍조 개선을 위해 시너지 레이저 시술을 추천해 드립니다.";
        }
        upsellTx = getTx('ldm');
    }

    else if (concern === 'acne') {
        if (budget === 'economy') {
            mainTx = getTx('mild_pdt');
            script = "여드름 관리를 처음 시작하신다면, 가성비 좋은 마일드 PDT를 추천합니다.";
        } else if (budget === 'standard') {
            mainTx = getTx('green_pdt');
            script = "일상생활에 지장을 주지 않으면서 여드름을 효과적으로 억제하는 그린 PDT가 적합합니다.";
        } else {
            mainTx = getTx('gold_ptt');
            script = "자외선 걱정 없이 피지선을 선택적으로 파괴하는 프리미엄 골드 PTT를 추천합니다.";
        }
        upsellTx = getTx('ldm');
    }

    else if (concern === 'lifting' || concern === 'sagging') {
        if (budget === 'economy') {
            mainTx = getTx('v_ro');
            script = "합리적인 가격으로 처짐과 탄력을 동시에 개선하는 브이로 리프팅을 추천합니다.";
        } else if (budget === 'standard') {
            mainTx = getTx('oligio'); // Found in allowed list
            script = "피부가 얇고 잔주름이 고민이라면, 진피층을 탄탄하게 조여주는 올리지오라 적합합니다.";
        } else {
            mainTx = getTx('titanium');
            script = "즉각적인 브라이트닝과 강력한 리프팅 효과를 원하신다면 티타늄 리프팅이 최고의 선택입니다.";
        }
        upsellTx = getTx('ldm');
    }

    else if (concern === 'pores') {
        // Potenza/Fraxis excluded. Use Juvelook or Lavieen.
        if (budget === 'premium') {
            mainTx = getTx('juvelook');
            script = "모공과 흉터를 동시에 개선하고 피부결을 매끄럽게 하는 쥬베룩 볼륨을 추천합니다.";
        } else {
            mainTx = getTx('lavieen');
            script = "늘어난 모공과 거친 피부결을 정돈하는 라비앙 레이저가 효과적입니다.";
        }
        upsellTx = getTx('cryo');
    }

    else if (concern === 'wrinkles') {
        if (budget === 'premium') {
            mainTx = getTx('titanium');
            script = "주름 개선과 리프팅 효과를 동시에 주는 티타늄 리프팅을 추천합니다.";
        } else {
            mainTx = getTx('oligio');
            script = "눈가와 얼굴의 잔주름을 개선하는데 탁월한 올리지오 리프팅을 추천합니다.";
        }
        upsellTx = getTx('ldm');
    }

    // Default Fallback
    if (!mainTx) {
        mainTx = getTx('mono_toning');
        script = "피부 본연의 건강을 되찾아주는 기본 토닝 프로그램부터 시작해보세요.";
    }

    return {
        main: mainTx!,
        upsell: upsellTx,
        script,
        package_info: "PKG 5 Sessions" // Placeholder
    };
}
