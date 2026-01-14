// Derived from homepage equipmentData
export type Treatment = {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn?: string;
    price: string;
    downtime: string;
    category: string;
    image?: string;
};

// Flattened list from the categories in equipmentData
export const TREATMENTS: Treatment[] = [
    // --- Lifting ---
    {
        id: 'oligio',
        name: '올리지오 (Oligio)',
        nameEn: 'Oligio',
        description: '한국형 써마지, 콜라겐 재생 및 타이트닝',
        price: 'Consultation',
        downtime: 'None',
        category: 'Lifting',
        image: '/images/equipment/oligio.png'
    },
    {
        id: 'trinity',
        name: '트리니티 (Trinity)',
        nameEn: 'Trinity',
        description: '3파장 레이저 리프팅/타이트닝/화이트닝',
        price: 'Consultation',
        downtime: 'None',
        category: 'Lifting',
        image: '/images/equipment/trinity.png'
    },
    {
        id: 'v_ro',
        name: '브이로 어드밴스 (V-Ro)',
        nameEn: 'V-Ro Advance',
        description: 'HIFU + RF 복합 리프팅',
        price: 'Consultation',
        downtime: 'Mild',
        category: 'Lifting',
        image: '/images/equipment/v-ro-advance.png'
    },
    {
        id: 'titanium',
        name: '티타늄 리프팅',
        nameEn: 'Titanium Lifting',
        description: '즉각적인 브라이트닝과 리프팅 효과',
        price: 'Consultation',
        downtime: 'None',
        category: 'Lifting',
        image: '/images/equipment/titanium.png' // Assuming image exists or placeholder
    },

    // --- Pigment ---
    {
        id: 'piccolo',
        name: '피콜로 프리미엄',
        nameEn: 'Piccolo Premium',
        description: '기미, 잡티, 문신 제거',
        price: 'Consultation',
        downtime: 'Redness 1-2 days',
        category: 'Pigmentation',
        image: '/images/equipment/piccolo_premium.png'
    },
    {
        id: 'revlite',
        name: '레블라이트 SI',
        nameEn: 'Revlite SI',
        description: 'PTP 기술을 이용한 기미 치료',
        price: 'Consultation',
        downtime: 'None',
        category: 'Pigmentation',
        image: '/images/equipment/revlite.png'
    },
    {
        id: 'element_tl',
        name: '엘레멘트TL',
        nameEn: 'Element-TL',
        description: '색소, 혈관, 제모 복합 치료',
        price: 'Consultation',
        downtime: 'None',
        category: 'Pigmentation',
        image: '/images/equipment/element_tl.png'
    },

    // --- Acne ---
    {
        id: 'accutoning',
        name: '아큐토닝',
        nameEn: 'AccuToning',
        description: '1450nm 레이저로 피지선 억제',
        price: 'Consultation',
        downtime: 'None',
        category: 'Acne',
        image: '/images/equipment/accutoning.png'
    },
    {
        id: 'capri',
        name: '카프리 레이저',
        nameEn: 'Kapri Laser',
        description: '여드름 박테리아 살균 및 피지선 파괴',
        price: 'Consultation',
        downtime: 'None',
        category: 'Acne',
        image: '/images/equipment/capri.png'
    },

    // --- Pores & Scars ---
    {
        id: 'fraxis',
        name: '프락시스 (CO2)',
        nameEn: 'Fraxis',
        description: '강력한 흉터 및 모공 개선',
        price: 'Consultation',
        downtime: 'Scabs 5-7 days',
        category: 'Scars',
        image: '/images/equipment/fraxis.jpg'
    },
    {
        id: 'potenza',
        name: '포텐자 (Potenza)',
        nameEn: 'Potenza',
        description: '마이크로 니들 RF로 모공/흉터 개선',
        price: 'Consultation',
        downtime: 'Redness 2-3 days',
        category: 'Scars',
        image: '/images/equipment/potenza.png'
    },
    {
        id: 'juvelook',
        name: '쥬베룩 볼륨',
        nameEn: 'Juvelook Volume',
        description: '자가 콜라겐 생성 촉진 (흉터/볼륨)',
        price: 'Consultation',
        downtime: 'Embossing 3-4 days',
        category: 'Scars',
        image: '/images/equipment/juvelook.png'
    },

    // --- Skincare ---
    {
        id: 'ldm',
        name: 'LDM 스마트 / 골드',
        nameEn: 'LDM Smart',
        description: '초음파 보습 및 진정 관리',
        price: 'Consultation',
        downtime: 'None',
        category: 'Skin Care',
        image: '/images/equipment/ldm.jpeg'
    },
    {
        id: 'rejuran',
        name: '리쥬란 힐러',
        nameEn: 'Rejuran Healer',
        description: 'PN 성분으로 피부 힐링 및 재생',
        price: 'Consultation',
        downtime: 'Embossing 1-2 days',
        category: 'Skin Care',
        image: '/images/equipment/rejuran.png'
    },
    // --- Programs (from PDF/Homepage) ---
    {
        id: 'wedding_package',
        name: '[웨딩관리] 8주 웨딩 패키지',
        nameEn: '8-Week Wedding Package',
        description: '승모근 보톡스 포함, 결혼 전 필수 관리 (8주)',
        price: 'Consultation',
        downtime: 'Varies',
        category: 'Program',
        image: ''
    },
    {
        id: 'acne_a4',
        name: '[여드름] A4 프로그램',
        nameEn: '[Acne] A4 Program',
        description: '여드름 집중 치료 4주 프로그램',
        price: 'Consultation',
        downtime: 'None',
        category: 'Program',
        image: ''
    },
    {
        id: 'acne_triple',
        name: '[여드름] 트리플 플러스 필',
        nameEn: 'Triple Plus Peel',
        description: '모공 청소 + 피지 제거 + 수분 공급 (복합 필링)',
        price: 'Consultation',
        downtime: 'None',
        category: 'Program',
        image: ''
    },
    {
        id: 'whitening_program',
        name: '[미백] 미백 집중 관리',
        nameEn: 'Whitening Intensive Care',
        description: '색소 침착 개선 및 톤업 (AGA/GA필)',
        price: 'Consultation',
        downtime: 'None',
        category: 'Program',
        image: ''
    }
];

export function getRecommendations(concerns: string[], skinType: string = 'normal'): Treatment[] {
    const recommended: Treatment[] = [];
    const isSensitive = skinType === 'sensitive';

    // --- Programs First Strategy ---

    // 1. Wedding (Special Case - if explicitly asked or broadly relevant? For now, if "Special Care" was a concern, but we don't have that yet. Let's add it if multiple concerns exist.)
    if (concerns.length >= 3) {
        recommended.push(TREATMENTS.find(t => t.id === 'wedding_package')!);
    }

    // 2. Acne Programs
    if (concerns.includes('acne')) {
        recommended.push(TREATMENTS.find(t => t.id === 'acne_a4')!);
        recommended.push(TREATMENTS.find(t => t.id === 'acne_triple')!);
        // Add machine backup
        recommended.push(TREATMENTS.find(t => t.id === 'accutoning')!);
    }

    // 3. Pigmentation / Whitening Programs
    if (concerns.includes('pigmentation')) {
        recommended.push(TREATMENTS.find(t => t.id === 'whitening_program')!);
        recommended.push(TREATMENTS.find(t => t.id === 'piccolo')!);
    }

    // 4. Lifting
    if (concerns.includes('wrinkles') || concerns.includes('sagging')) {
        if (isSensitive) {
            recommended.push(TREATMENTS.find(t => t.id === 'titanium') || TREATMENTS[0]);
            recommended.push(TREATMENTS.find(t => t.id === 'ldm')!);
        } else {
            recommended.push(TREATMENTS.find(t => t.id === 'oligio')!);
            recommended.push(TREATMENTS.find(t => t.id === 'v_ro')!);
        }
    }

    // 5. Pores / Scars
    if (concerns.includes('pores') || concerns.includes('scars')) {
        if (isSensitive) {
            recommended.push(TREATMENTS.find(t => t.id === 'juvelook')!);
            recommended.push(TREATMENTS.find(t => t.id === 'potenza')!);
        } else {
            recommended.push(TREATMENTS.find(t => t.id === 'fraxis')!);
        }
    }

    // 6. Dryness
    if (concerns.includes('dryness')) {
        recommended.push(TREATMENTS.find(t => t.id === 'ldm')!);
        recommended.push(TREATMENTS.find(t => t.id === 'rejuran')!);
    }

    // Fallback
    if (recommended.length === 0) {
        recommended.push(TREATMENTS.find(t => t.id === 'ldm')!);
    }

    return Array.from(new Set(recommended)).slice(0, 4);
}
