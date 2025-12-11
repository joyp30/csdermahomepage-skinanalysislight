// Derived from homepage equipmentData and AI Logic Report
export type Treatment = {
    id: string; // SKU ID (e.g., '1-1', 'oligio')
    name: string;
    nameEn: string;
    description: string;
    descriptionEn?: string;
    price: string;
    priceValue: number; // For logic
    downtime: string;
    downtimeLevel: number; // 0-5
    painLevel: number; // 1-10
    category: 'Pigmentation' | 'Redness' | 'Acne' | 'Scars' | 'Lifting' | 'Skin Care' | 'Program';
    targetLayer?: 'Epidermis' | 'Dermis' | 'SMAS' | 'Fat' | 'Sebaceous Gland' | 'All';
    image?: string;
};

// Flattened list from the categories in equipmentData & AI Report
export const TREATMENTS: Treatment[] = [
    // --- Pigmentation (Module I) ---
    {
        id: '1-1',
        name: '일반모노토닝',
        nameEn: 'General Mono Toning',
        description: '멜라닌 색소만을 선택적으로 파괴하는 레블라이트 토닝과 피부 재생 레이저를 결합한 기본 기미 치료',
        price: '200,000 ~',
        priceValue: 200000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 2,
        category: 'Pigmentation',
        targetLayer: 'Dermis',
        image: '/images/equipment/revlite.png'
    },
    {
        id: '1-2',
        name: '샤이닝모노토닝',
        nameEn: 'Shining Mono Toning',
        description: '히알루론산 성분의 샤이닝 주사를 이용해 피부 속 수분을 채우고 건조함과 잔주름을 개선하며, 토닝과 병행하여 맑고 투명한 피부를 완성 (유지기간 2-3개월)',
        price: '230,000 ~',
        priceValue: 230000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 3,
        category: 'Pigmentation',
        targetLayer: 'Dermis'
    },
    {
        id: '2-1',
        name: '라비앙 (비비레이저)',
        nameEn: 'Lavieen BB Laser',
        description: '1927nm 툴륨 레이저를 이용해 상피 손상을 최소화하면서 색소, 모공, 탄력을 동시에 개선. 비비크림을 바른 듯 화사한 피부 효과 (미세 딱지 발생)',
        price: '165,000 ~',
        priceValue: 165000,
        downtime: 'Scabs 5-7 days',
        downtimeLevel: 3,
        painLevel: 5,
        category: 'Pigmentation',
        targetLayer: 'Epidermis',
        image: '/images/equipment/piccolo_premium.png'
    },
    {
        id: '5-13',
        name: '골드 PTT',
        nameEn: 'Gold PTT',
        description: '특수 골드 나노 입자를 모공에 침투시킨 뒤 레이저를 조사하여 피지선만을 선택적으로 파괴. 재발 억제에 효과적이며 시술 후 자외선 차단 제약이 적음',
        price: '330,000 ~',
        priceValue: 330000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 2,
        category: 'Acne',
        targetLayer: 'Sebaceous Gland',
        image: '/images/equipment/capri.png'
    },
    {
        id: '8-1',
        name: '브이로 어드밴스 (V-Ro)',
        nameEn: 'V-Ro Advance',
        description: 'HIFU(집속 초음파)와 RF(고주파)를 교차 조사하여 진피층부터 SMAS층까지 탄력 개선. 통증을 최소화하며 이중턱과 윤곽 라인을 매끄럽게 정리',
        price: 'Consultation',
        priceValue: 300000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 3,
        category: 'Lifting',
        targetLayer: 'SMAS',
        image: '/images/equipment/v-ro-advance.png'
    },
    {
        id: '8-6',
        name: '올리지오 (Oligio)',
        nameEn: 'Oligio',
        description: '한국형 써마지로 불리는 모노폴라 RF 시술. 진피층에 강한 열을 전달하여 콜라겐을 생성하고 타이트닝 효과를 주며, 통증이 적어 편안한 시술 가능 (4-6개월 간격 권장)',
        price: '385,000 ~',
        priceValue: 385000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 4,
        category: 'Lifting',
        targetLayer: 'Dermis',
        image: '/images/equipment/oligio.png'
    },
    {
        id: '8-21',
        name: '엘사 (LSSA)',
        nameEn: 'Elsa (LSSA)',
        description: '세계 최소 직경 0.9mm의 초음파 프로브를 이용해 신경 손상 없이 지방 세포만을 선택적으로 액상화하여 배출하는 초음파 지방 융해술 (최소 침습, 빠른 회복)',
        price: 'Consultation',
        priceValue: 200000,
        downtime: 'Swelling 2-3 days',
        downtimeLevel: 1,
        painLevel: 2,
        category: 'Lifting',
        targetLayer: 'Fat',
        image: '/images/equipment/v-ro-advance.png'
    },
    {
        id: '1-3',
        name: '듀얼토닝',
        nameEn: 'Dual Toning',
        description: '진피층의 깊은 색소와 표피층의 얕은 색소를 동시에 치료하여 더욱 빠른 미백 효과를 유도',
        price: '240,000 ~',
        priceValue: 240000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 3,
        category: 'Pigmentation',
        targetLayer: 'Dermis'
    },
    {
        id: '1-5',
        name: '트리플플러스토닝',
        nameEn: 'Triple Plus Toning',
        description: '3가지 레이저 모드를 이용하여 난치성 기미와 잡티를 동시에 해결하고 진정 관리까지 포함된 프리미엄 코스',
        price: '300,000 ~',
        priceValue: 300000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 3,
        category: 'Pigmentation',
        targetLayer: 'Dermis'
    },
    {
        id: '2-1',
        name: '라비앙 (비비레이저)',
        nameEn: 'Lavieen BB Laser',
        description: '1927nm 툴륨(Thulium) 레이저를 이용해 상피 손상을 최소화하면서 색소와 모공을 동시에 개선 (비비크림 바른 듯한 효과, 미세딱지 발생)',
        price: '165,000 ~',
        priceValue: 165000,
        downtime: 'Scabs 5-7 days',
        downtimeLevel: 3,
        painLevel: 5,
        category: 'Pigmentation',
        targetLayer: 'Epidermis',
        image: '/images/equipment/piccolo_premium.png'
    },
    {
        id: '2-4',
        name: '잡티제거 (일반형)',
        nameEn: 'Spot Removal (Basic)',
        description: '다파장 IPL(셀렉V)과 피코초 레이저(피코)를 복합 사용하여 표피성 주근깨와 흑자를 빠르고 깨끗하게 제거',
        price: '300,000 ~',
        priceValue: 300000,
        downtime: 'Scabs 5-7 days',
        downtimeLevel: 3,
        painLevel: 5,
        category: 'Pigmentation',
        targetLayer: 'Epidermis'
    },
    {
        id: '2-5',
        name: '잡티제거 (고급형)',
        nameEn: 'Spot Removal (Premium)',
        description: '잡티제거 일반형 시술에 -15도 크라이오 진정 관리를 더해 시술 후 열감과 붉은기를 즉각적으로 완화',
        price: '350,000 ~',
        priceValue: 350000,
        downtime: 'Scabs 5-7 days',
        downtimeLevel: 3,
        painLevel: 5,
        category: 'Pigmentation',
        targetLayer: 'Epidermis'
    },

    // --- Redness (Module II) ---
    {
        id: '4-1',
        name: '여드름 붉은자국(셀렉)',
        nameEn: 'Acne Redness (Cellec)',
        description: '셀렉V의 530nm-560nm 파장을 이용하여 여드름 염증 후 남은 붉은 혈관(PIE)만을 선택적으로 치료',
        price: '220,000 ~',
        priceValue: 220000,
        downtime: 'None',
        downtimeLevel: 1,
        painLevel: 3,
        category: 'Redness',
        targetLayer: 'Dermis',
        image: '/images/equipment/element_tl.png'
    },
    {
        id: '4-6',
        name: '시너지 홍조',
        nameEn: 'Synergy Redness',
        description: '585nm PDL과 1064nm Nd:YAG가 동시에 조사되는 멀티플렉스 기술로 확장된 혈관을 수축시키고 콜라겐을 재생',
        price: '400,000 ~',
        priceValue: 400000,
        downtime: 'Mild Redness',
        downtimeLevel: 2,
        painLevel: 4,
        category: 'Redness',
        targetLayer: 'Dermis'
    },
    {
        id: '4-7',
        name: '셀렉V 홍조',
        nameEn: 'Cellec V Redness',
        description: '9가지 파장의 필터를 이용하여 표피층의 얕은 홍조와 잡티를 동시에 개선하는 IPL 시술',
        price: '200,000 ~',
        priceValue: 200000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 3,
        category: 'Redness',
        targetLayer: 'Epidermis'
    },
    {
        id: '4-10',
        name: '시너지 홍조복합2',
        nameEn: 'Synergy Redness Complex',
        description: '시너지 레이저의 혈관 치료 효과와 소노케어(LDM)의 물방울 리프팅 효과를 결합하여 홍조와 건조함을 동시에 해결',
        price: '450,000 ~',
        priceValue: 450000,
        downtime: 'None',
        downtimeLevel: 1,
        painLevel: 4,
        category: 'Redness',
        targetLayer: 'Dermis'
    },

    // --- Acne (Module III) ---
    {
        id: '5-10',
        name: '마일드 PDT',
        nameEn: 'Mild PDT',
        description: '광감작제(Photosensitizer)를 도포 후 빛을 조사하여 피지선을 억제하고 여드름균(P.acnes)을 살균',
        price: '120,000 ~',
        priceValue: 120000,
        downtime: 'Sun Avoidance required',
        downtimeLevel: 2,
        painLevel: 2,
        category: 'Acne',
        targetLayer: 'Sebaceous Gland'
    },
    {
        id: '5-11',
        name: '그린 PDT',
        nameEn: 'Green PDT',
        description: '천연 엽록소(Chlorophyll) 성분을 이용한 저자극 PDT로, 시술 후 자외선 차단 주의가 비교적 적음',
        price: '170,000 ~',
        priceValue: 170000,
        downtime: 'Sun Avoidance required',
        downtimeLevel: 2,
        painLevel: 3,
        category: 'Acne',
        targetLayer: 'Sebaceous Gland'
    },
    {
        id: '5-13',
        name: '골드 PTT',
        nameEn: 'Gold PTT',
        description: '특수 골드 나노 입자(Gold Nanoparticle)를 모공 깊숙이 침투시킨 뒤 열으 가해 피지선만 선택적으로 파괴 (PDT 대비 햇빛 영향 없음)',
        price: '330,000 ~',
        priceValue: 330000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 2,
        category: 'Acne',
        targetLayer: 'Sebaceous Gland',
        image: '/images/equipment/capri.png'
    },
    {
        id: '5-25',
        name: '여드름 토탈케어 8주',
        nameEn: 'Acne My Cure (8 Weeks)',
        description: '8주간 규칙적인 내원을 통해 여드름의 염증기부터 흉터 회복기까지 맞춤형으로 관리하는 집중 프로그램',
        price: '1,200,000 ~',
        priceValue: 1200000,
        downtime: 'Varies',
        downtimeLevel: 2,
        painLevel: 3,
        category: 'Program',
        targetLayer: 'All'
    },
    {
        id: '6-1',
        name: '여드름 흉터 (CO2/어븀)',
        nameEn: 'Acne Scars (CO2/Erbium)',
        description: '흉터의 경계면을 정교하게 깎아내는 박피성 레이저(Ablative Laser)로, 새 살이 차오르게 함 (듀오덤 부착 필수)',
        price: '198,000 ~',
        priceValue: 198000,
        downtime: 'Scabs 7 days',
        downtimeLevel: 5,
        painLevel: 7,
        category: 'Scars',
        targetLayer: 'Dermis',
        image: '/images/equipment/fraxis.jpg'
    },
    {
        id: '6-3',
        name: '여드름 흉터 (피코프락셀)',
        nameEn: 'Acne Scars (Pico Fraxel)',
        description: 'LIOB(Laser Induced Optical Breakdown) 기술로 표피 손상 없이 진피 내 미세 공간을 만들어 콜라겐 재생 유도',
        price: '275,000 ~',
        priceValue: 275000,
        downtime: 'Redness 2-3 days',
        downtimeLevel: 2,
        painLevel: 5,
        category: 'Scars',
        targetLayer: 'Dermis',
        image: '/images/equipment/piccolo_premium.png'
    },

    // --- Lifting (Module IV) ---
    {
        id: '8-1',
        name: '브이로 어드밴스 (V-Ro)',
        nameEn: 'V-Ro Advance',
        description: '고강도 집속 초음파(HIFU)와 고주파(RF)를 교차 조사(SD방식)하여 통증은 줄이고 리프팅 효과는 극대화',
        price: 'Consultation',
        priceValue: 300000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 3,
        category: 'Lifting',
        targetLayer: 'SMAS',
        image: '/images/equipment/v-ro-advance.png'
    },
    {
        id: '8-6',
        name: '올리지오 (Oligio)',
        nameEn: 'Oligio',
        description: '지능형 냉각 시스템을 갖춘 모노폴라 고주파(Monopolar RF)로 진피층에 강한 타이닝 효과 제공 (한국형 써마지)',
        price: '385,000 ~',
        priceValue: 385000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 4,
        category: 'Lifting',
        targetLayer: 'Dermis',
        image: '/images/equipment/oligio.png'
    },
    {
        id: '8-21',
        name: '엘사 (LSSA)',
        nameEn: 'Elsa (LSSA)',
        description: '직경 0.9mm의 초음파 프로브를 이용해 지방 세포만을 선택적으로 녹여내는 초음파 지방 융해술 (이중턱/심부볼, 최소 침습)',
        price: 'Consultation',
        priceValue: 200000,
        downtime: 'Swelling 2-3 days',
        downtimeLevel: 1,
        painLevel: 2,
        category: 'Lifting',
        targetLayer: 'Fat',
        image: '/images/equipment/v-ro-advance.png'
    },
    {
        id: '8-7',
        name: '더올려S (브이로+올리지오)',
        nameEn: 'The Ol-Lyeo S',
        description: '피부 속과 겉을 동시에 당겨주는 브이로와 올리지오의 결합으로 최상의 리프팅 효과 (스마트 컨설트 추천)',
        price: '1,100,000 ~',
        priceValue: 1100000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 4,
        category: 'Lifting',
        targetLayer: 'SMAS'
    },

    // --- Add-ons / Skin Care ---
    {
        id: '16-1',
        name: '진정 관리',
        nameEn: 'Soothing Care',
        description: '레이저 시술 직후 붉어진 피부 온도를 낮추고 수분을 공급하여 빠른 회복을 돕는 필수 관리',
        price: '66,000',
        priceValue: 66000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 0,
        category: 'Skin Care',
        targetLayer: 'Epidermis',
        image: '/images/equipment/ldm.jpeg'
    },
    {
        id: '19-2',
        name: 'LDM 리프팅 모드',
        nameEn: 'LDM Lifting',
        description: '고밀도 초음파 에너지로 피부 속 수분을 끌어올려 즉각적인 탄력과 물광 효과를 부여',
        price: '66,000',
        priceValue: 66000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 0,
        category: 'Skin Care',
        targetLayer: 'Dermis'
    },
    {
        id: '11-4',
        name: '리쥬란 HB+',
        nameEn: 'Rejuran HB+',
        description: '기존 리쥬란의 통증을 50% 줄이고 히알루론산을 더해 재생과 보습 효과를 극대화한 스킨부스터',
        price: 'Consultation',
        priceValue: 350000,
        downtime: 'Embossing 1-2 days',
        downtimeLevel: 2,
        painLevel: 4,
        category: 'Skin Care',
        targetLayer: 'Dermis',
        image: '/images/equipment/rejuran.png'
    },

    // --- Programs (Previous) ---
    {
        id: 'wedding_package',
        name: '[웨딩관리] 8주 웨딩 패키지',
        nameEn: '8-Week Wedding Package',
        description: '결혼을 앞둔 신부님을 위해 드레스 라인(승모근)부터 피부 톤, 결, 탄력까지 8주간 집중 관리',
        price: 'Consultation',
        priceValue: 1000000,
        downtime: 'Varies',
        downtimeLevel: 1,
        painLevel: 3,
        category: 'Program',
        image: ''
    },
    {
        id: 'acne_a4',
        name: '[여드름] A4 프로그램',
        nameEn: '[Acne] A4 Program',
        description: '반복되는 여드름을 끊어내기 위한 4주 집중 치료 (압출+염증주사+PDT+스케일링 포함)',
        price: 'Consultation',
        priceValue: 600000,
        downtime: 'None',
        downtimeLevel: 1,
        painLevel: 2,
        category: 'Program',
        image: ''
    },
    {
        id: 'acne_triple',
        name: '[여드름] 트리플 플러스 필',
        nameEn: 'Triple Plus Peel',
        description: '3단계 특수 필링으로 묵은 각질과 모공 속 피지를 한 번에 정리하여 매끄러운 피부 완성',
        price: 'Consultation',
        priceValue: 150000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 1,
        category: 'Program',
        image: ''
    },
    {
        id: 'whitening_program',
        name: '[미백] 미백 집중 관리',
        nameEn: 'Whitening Intensive Care',
        description: '칙칙한 피부 톤을 밝히고 불규칙한 색소를 정리하는 고농축 미백 관리 프로그램',
        price: 'Consultation',
        priceValue: 150000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 1,
        category: 'Program',
        image: ''
    },
    {
        id: '7-1',
        name: '아쿠아필',
        nameEn: 'Aqua Peel',
        description: '3단계 특수 용액을 이용하여 모공 속 노폐물과 피지, 블랙헤드를 녹여내고 수분을 채워주는 저자극 필링',
        price: '49,000 ~',
        priceValue: 49000,
        downtime: 'None',
        downtimeLevel: 0,
        painLevel: 0,
        category: 'Skin Care',
        targetLayer: 'Epidermis',
        image: '/images/equipment/aquapeel.png'
    },
];

// --- Logic Helper Functions ---

function calculateScore(treatment: Treatment, answers: any): number {
    let score = 0;
    const concerns = (answers.q1_concerns as string[]) || [];
    const skinType = (answers.q2_skin_type as string) || 'normal';
    const budget = (answers.q_budget as string) || 'standard';
    const downtime = (answers.q_downtime as string) || 'weekend';
    const pigmentType = answers.q_pigment_type;
    const rednessType = answers.q_redness_type;
    const acneState = answers.q_acne_state;
    const liftingType = answers.q1_details_lifting; // Or check concerns

    // 1. Symptom Match (Weight: Highly Critical)
    if (treatment.category === 'Program') {
        // Only boost Programs if they match the specific concern context
        if (concerns.length >= 3 && treatment.id === 'wedding_package' && downtime === 'none') score += 5;
        else if (concerns.includes('acne') && treatment.id.startsWith('acne_')) score += 3;
        else if (concerns.includes('pigmentation') && treatment.id === 'whitening_program') score += 3;
    }

    if (concerns.includes('pigmentation') && treatment.category === 'Pigmentation') {
        score += 2;
        if (pigmentType === 'mist' && treatment.id === '1-2' && skinType === 'dry') score += 3; // Rule: Dry Melasma -> 1-2
        else if (pigmentType === 'mist' && treatment.id === '1-3' && skinType !== 'dry') score += 3;
        else if (pigmentType === 'mist' && (treatment.id === '2-1' || treatment.id.startsWith('2-4'))) score -= 5; // Contraindication: Strong laser for Melasma
        else if (pigmentType === 'spot' && (treatment.id === '2-4' || treatment.id === '2-5')) score += 4; // Freckles -> Spot Removal
        else if (pigmentType === 'pih' && (treatment.id === '4-1')) score += 3; // PIH -> 4-1 (from report Module I)
        else if (pigmentType === 'dull' && treatment.id === '2-1') score += 3; // Dullness -> Lavieen
    }

    if (concerns.includes('redness') && treatment.category === 'Redness') {
        score += 2;
        if (rednessType === 'acne_red' && treatment.id === '4-1') score += 3;
        else if (rednessType === 'flush' && treatment.id === '4-10') score += 4; // Flush -> Synergy+Sono
        else if (rednessType === 'veins' && treatment.id === '4-6') score += 4; // Veins -> Synergy
    }

    if (concerns.includes('acne')) {
        if (treatment.category === 'Acne') {
            score += 2;
            if (acneState === 'comedonal' && (treatment.id === '5-9' || treatment.id === '5-10')) score += 3;
            else if (acneState === 'inflammatory' && treatment.id === '5-13') score += 3; // Gold PTT
        }
        if (acneState === 'scars_pores' && treatment.category === 'Scars') {
            score += 5; // Strong push for scars treatment if that's the state
        }
    }

    // Pores specific logic (New)
    if (concerns.includes('pores')) {
        if (treatment.id === 'acne_triple') score += 3; // Triple Peel
        if (treatment.category === 'Skin Care' && treatment.id === '7-1') score += 4; // Aqua Peel (Need to ensure 7-1 exists in TREATMENTS)
    }

    // Scars logic
    if (concerns.includes('scars') && treatment.category === 'Scars') {
        score += 2;
        if (downtime === 'week' && treatment.id === '6-1') score += 4; // CO2 strong
        else if (downtime !== 'week' && treatment.id === '6-3') score += 4; // Pico lesser downtime
    }

    if ((concerns.includes('sagging') || concerns.includes('wrinkles') || concerns.includes('fat')) && treatment.category === 'Lifting') {
        score += 2;
        if (concerns.includes('fat') && treatment.id === '8-21') score += 5; // Fat -> Elsa
        else if (concerns.includes('sagging') && treatment.id === '8-1') score += 3; // Sagging -> V-Ro
        else if (concerns.includes('wrinkles') && treatment.id === '8-6') score += 3; // Wrinkles -> Oligio
    }

    // 2. Budget Fit
    // 2. Budget Fit
    if (treatment.priceValue) {
        if (budget === 'economy') {
            if (treatment.priceValue >= 200000) score -= 3; // Penalize if above budget (200k)
            else score += 2; // Boost if fits
        }
        if (budget === 'standard' && treatment.priceValue >= 200000 && treatment.priceValue <= 450000) score += 1;
        if (budget === 'premium' && treatment.priceValue > 500000) score += 2; // Up-sell to premium
    }

    // 3. Downtime Fit
    if (downtime === 'none' && treatment.downtimeLevel > 0) score -= 5; // Critical mismatch
    if (downtime === 'weekend' && treatment.downtimeLevel > 3) score -= 3;

    // 4. Upsell / Bundle Logic
    // If selecting strong laser, boost associated care items? 
    // This function scores INDIVIDUAL treatments. Bundling happens after selection.

    return score;
}

export function getRecommendations(answers: any): Treatment[] {
    const concerns = (answers.q1_concerns as string[]) || [];

    // Score all treatments
    const scored = TREATMENTS.map(t => ({
        treatment: t,
        score: calculateScore(t, answers)
    }));

    // Sort by score desc
    scored.sort((a, b) => b.score - a.score);

    // Filter out negative scores (hard stops)
    let candidates = scored.filter(s => s.score > 0).map(s => s.treatment);

    // --- Upselling / Add-on Logic ---
    // If top candidate is Laser (Pigment/Redness/Scars), add specialized care if not present
    const top = candidates[0];
    if (top) {
        if (['Pigmentation', 'Redness', 'Scars'].includes(top.category)) {
            // Add Soothing Care or LDM if not already in top 4
            const soothing = TREATMENTS.find(t => t.id === '16-1');
            if (soothing && !candidates.includes(soothing)) {
                candidates.splice(1, 0, soothing); // Insert 2nd
            }
        }
        if (top.category === 'Lifting' && top.id === 'oligio') {
            // Suggest Sono/LDM
            const ldm = TREATMENTS.find(t => t.id === '19-2');
            if (ldm && !candidates.includes(ldm)) {
                candidates.splice(1, 0, ldm);
            }
        }
    }

    return candidates.slice(0, 4);
}
