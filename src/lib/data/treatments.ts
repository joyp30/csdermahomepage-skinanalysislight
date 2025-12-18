// Derived from homepage equipmentData
export type Treatment = {
    id: string;
    sku_id?: string; // e.g., "1-1", "8-6"
    name: string;
    nameEn: string;
    description: string;
    descriptionEn?: string;
    price: string;
    downtime: string;
    category: string;
    image?: string;
    machineNames?: string[];
    logic_tags?: {
        downtime_level?: 'zero' | 'social' | 'strict'; // Social = red/rough but no tape; Strict = tape
        uv_risk?: 'high' | 'low' | 'none';
        pain_level?: 'mild' | 'moderate' | 'high';
        target_layer?: 'epidermis' | 'dermis' | 'smas' | 'fat';
        visual_type?: 'melasma' | 'freckle' | 'pih';
    };
};

export const TREATMENTS: Treatment[] = [
    // --- 1. Pigmentation (Toning / Whitening) ---
    {
        id: 'mono_toning',
        sku_id: '1-1',
        name: '일반 모노 토닝',
        nameEn: 'General Mono Toning',
        description: '자극 없이 멜라닌만 선택 파괴 (데일리 케어)',
        price: '200,000',
        downtime: 'None',
        category: 'Pigmentation',
        image: '/images/equipment/revlite.png',
        logic_tags: { downtime_level: 'zero', visual_type: 'melasma', pain_level: 'mild' }
    },
    {
        id: 'dual_toning',
        sku_id: '1-3',
        name: '듀얼 토닝 (미백)',
        nameEn: 'Dual Toning',
        description: '토닝 + 이온토 비타민 침투 (미백 효과 UP)',
        price: '240,000',
        downtime: 'None',
        category: 'Pigmentation',
        image: '/images/equipment/revlite.png',
        logic_tags: { downtime_level: 'zero', visual_type: 'melasma' }
    },
    {
        id: 'triple_toning',
        sku_id: '1-5',
        name: '트리플 플러스 토닝',
        nameEn: 'Triple Plus Toning',
        description: '3가지 레이저 복합 시술 (기미/잡티/톤업 동시 해결)',
        price: '300,000',
        downtime: 'None',
        category: 'Pigmentation',
        image: '/images/equipment/trinity.png',
        logic_tags: { downtime_level: 'zero', visual_type: 'melasma' }
    },
    {
        id: 'lavieen',
        sku_id: '2-1',
        name: '라비앙 BB 레이저',
        nameEn: 'Lavieen BB Laser',
        description: '피부결+톤업 (딱지 없음, 5~7일간 사포 같은 거칠기)',
        price: '165,000',
        downtime: 'Sandpaper Texture (5-7 days)',
        category: 'Pigmentation',
        image: '/images/equipment/lavieen.png',
        logic_tags: { downtime_level: 'social', visual_type: 'freckle' }
    },
    {
        id: 'blemish_general',
        sku_id: '2-4',
        name: '잡티제거 (일반형)',
        nameEn: 'Blemish Removal (General)',
        description: '경계가 명확한 색소 강력 제거 (듀오덤 2주 필수)',
        price: '300,000',
        downtime: 'Tape Required (2 Weeks)',
        category: 'Pigmentation',
        machineNames: ['CellEc V', 'Pico'],
        logic_tags: { downtime_level: 'strict', visual_type: 'freckle', pain_level: 'moderate' }
    },
    {
        id: 'blemish_premium',
        sku_id: '2-5',
        name: '잡티제거 (고급형)',
        nameEn: 'Blemish Removal (Premium)',
        description: '저통증 색소 제거 + 재생 관리 포함 (듀오덤 2주)',
        price: '350,000',
        downtime: 'Tape Required (2 Weeks)',
        category: 'Pigmentation',
        logic_tags: { downtime_level: 'strict', visual_type: 'freckle', pain_level: 'mild' }
    },

    // --- 2. Redness ---
    {
        id: 'redness_acne',
        sku_id: '4-2',
        name: '여드름 붉은자국+색소',
        nameEn: 'Acne Redness & Pigment',
        description: '혈관 레이저와 토닝을 결합하여 자국 제거',
        price: 'Consultation',
        downtime: 'None',
        category: 'Redness',
        machineNames: ['CellEc V', 'Toning'],
        logic_tags: { downtime_level: 'zero', visual_type: 'pih' }
    },
    {
        id: 'synergy_flush',
        sku_id: '4-6',
        name: '시너지 홍조',
        nameEn: 'Synergy Redness',
        description: '혈관 전용 레이저로 안면 홍조 개선',
        price: '300,000+',
        downtime: 'Mild Redness',
        category: 'Redness',
        logic_tags: { downtime_level: 'zero', pain_level: 'moderate' }
    },

    // --- 5. Acne ---
    {
        id: 'mild_pdt',
        sku_id: '5-10',
        name: '마일드 PDT',
        nameEn: 'Mild PDT',
        description: '가성비 여드름 치료 (시술 후 48시간 자외선 차단 필수)',
        price: '120,000',
        downtime: 'Sun Avoidance 48h',
        category: 'Acne',
        logic_tags: { uv_risk: 'high', pain_level: 'mild' }
    },
    {
        id: 'green_pdt',
        sku_id: '5-10b', // Assigning ad-hoc ID if not in file, assuming alternative
        name: '그린 PDT',
        nameEn: 'Green PDT',
        description: '일상생활 가능한 여드름 치료 (자외선 영향 적음)',
        price: '170,000',
        downtime: 'Mild',
        category: 'Acne',
        logic_tags: { uv_risk: 'low', pain_level: 'mild' }
    },
    {
        id: 'gold_ptt',
        sku_id: '5-13',
        name: '골드 PTT',
        nameEn: 'Gold PTT',
        description: '특수 골드 입자로 피지선 파괴 (자외선 무관, 일상생활 즉시 가능)',
        price: '330,000',
        downtime: 'None',
        category: 'Acne',
        logic_tags: { uv_risk: 'none', pain_level: 'mild' }
    },

    // --- 8. Lifting ---
    {
        id: 'v_ro',
        sku_id: '8-1',
        name: '브이로 어드밴스',
        nameEn: 'V-Ro Advance',
        description: '이중턱/심부볼 처짐 개선 (HIFU+RF)',
        price: '440,000',
        downtime: 'Mild',
        category: 'Lifting',
        image: '/images/equipment/v-ro-advance.png',
        logic_tags: { target_layer: 'smas', pain_level: 'mild' }
    },
    {
        id: 'oligio',
        sku_id: '8-6',
        name: '올리지오 600샷 (+소노케어)',
        nameEn: 'Oligio 600 Shots',
        description: '피부가 얇은 분들을 위한 타이트닝',
        price: '660,000',
        downtime: 'None',
        category: 'Lifting',
        image: '/images/equipment/oligio.png',
        logic_tags: { target_layer: 'dermis', pain_level: 'moderate' }
    },
    {
        id: 'double_up',
        sku_id: '8-7',
        name: '더올려 (올리지오+브이로)',
        nameEn: 'Double Up Lifting',
        description: '겉과 속을 동시에 당기는 프리미엄 리프팅',
        price: '1,100,000',
        downtime: 'Mild',
        category: 'Lifting',
        logic_tags: { target_layer: 'smas' }
    },
    {
        id: 'elsa',
        sku_id: '8-21',
        name: '엘사 (LSSA)',
        nameEn: 'Elsa',
        description: '지방 분해 리프팅 (얼굴 살이 많은 경우)',
        price: '594,000',
        downtime: 'None',
        category: 'Lifting',
        logic_tags: { target_layer: 'fat' }
    },
    {
        id: 'titanium',
        name: '티타늄 리프팅',
        nameEn: 'Titanium Lifting',
        description: '즉각적인 브라이트닝과 리프팅 효과',
        price: 'Consultation',
        downtime: 'None',
        category: 'Lifting',
        image: '/images/equipment/titanium.png',
        logic_tags: { target_layer: 'dermis', pain_level: 'mild' }
    },

    // --- Scars ---
    {
        id: 'fraxis',
        name: '프락시스 (CO2)',
        nameEn: 'Fraxis',
        description: '강력한 흉터 및 모공 개선',
        price: '180,000',
        downtime: 'Scabs 5-7 days',
        category: 'Scars',
        image: '/images/equipment/fraxis.jpg',
        logic_tags: { downtime_level: 'strict' }
    },
    {
        id: 'potenza',
        name: '포텐자 (Potenza)',
        nameEn: 'Potenza',
        description: '마이크로 니들 RF로 모공/흉터 개선',
        price: 'Consultation',
        downtime: 'Redness 2-3 days',
        category: 'Scars',
        image: '/images/equipment/potenza.png',
        logic_tags: { downtime_level: 'social' }
    },
    {
        id: 'juvelook',
        name: '쥬베룩 볼륨',
        nameEn: 'Juvelook Volume',
        description: '자가 콜라겐 생성 촉진 (흉터/볼륨)',
        price: '690,000',
        downtime: 'Embossing 3-4 days',
        category: 'Scars',
        image: '/images/equipment/juvelook.png',
        logic_tags: { downtime_level: 'social' }
    },

    // --- Care / Upsell Items ---
    {
        id: 'cryo',
        sku_id: '16-1',
        name: '크라이오 진정 관리',
        nameEn: 'Cryo Soothing Care',
        description: '레이저 후 붉은기/열감 즉각 진정',
        price: '66,000',
        downtime: 'None',
        category: 'Skin Care',
        logic_tags: { pain_level: 'mild' }
    },
    {
        id: 'ldm',
        sku_id: '19-2',
        name: 'LDM 물방울 리프팅',
        nameEn: 'LDM Lifting',
        description: '고밀도 초음파로 수분 충전 및 진정',
        price: '66,000',
        downtime: 'None',
        category: 'Skin Care',
        image: '/images/equipment/ldm.jpeg',
        logic_tags: { pain_level: 'mild' }
    },
    {
        id: 'rejuran_hb',
        sku_id: '11-4',
        name: '리쥬란 HB+',
        nameEn: 'Rejuran HB+',
        description: '통증을 줄인 리쥬란 (프리미엄, 리도카인 포함)',
        price: '175,000',
        downtime: 'Embossing 1-2 days',
        category: 'Skin Care',
        logic_tags: { pain_level: 'mild' }
    },
    {
        id: 'rejuran',
        sku_id: '11-11',
        name: '리쥬란 힐러',
        nameEn: 'Rejuran Healer',
        description: '가장 강력한 피부 재생 (통증 있음)',
        price: '175,000',
        downtime: 'Embossing 1-2 days',
        category: 'Skin Care',
        image: '/images/equipment/rejuran.png',
        logic_tags: { pain_level: 'high' }
    }
];

// Note: getRecommendations logic needs to be moved or updated to use these new tags.
// For backward compatibility, we keep a dummy function here, but the real logic should reside in a dedicated logic file.
export function getRecommendations(concerns: string[], skinType: string = 'normal'): Treatment[] {
    return TREATMENTS.slice(0, 3); // Placeholder, logic moved to src/lib/logic/light-mode.ts
}
