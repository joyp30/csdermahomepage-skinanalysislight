export type QuestionOption = {
    id: string;
    label: string;
    value: string;
    description?: string;
};

export type SurveyQuestion = {
    id: string;
    category: string;
    title: string;
    subtitle?: string;
    type: 'single' | 'multiple' | 'scale';
    options: QuestionOption[];
    condition?: (answers: any) => boolean;
    modes?: ('light' | 'full' | 'pro')[]; // If undefined, show in all modes
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
    {
        id: 'q1_concerns',
        category: 'General',
        title: '가장 큰 피부 고민은 무엇인가요?',
        subtitle: '해당하는 항목을 모두 선택해주세요.',
        type: 'multiple',
        options: [
            { id: 'pigmentation', label: '기미 / 잡티 / 색소침착', value: 'pigmentation' },
            { id: 'acne', label: '여드름 / 트러블', value: 'acne' },
            { id: 'pores', label: '넓은 모공', value: 'pores' },
            { id: 'wrinkles', label: '주름 / 탄력 저하', value: 'wrinkles' },
            { id: 'sagging', label: '처짐 / 리프팅 필요', value: 'sagging' },
            { id: 'fat', label: '이중턱 / 얼굴 살', value: 'fat' },
            { id: 'redness', label: '안면홍조 / 붉은기', value: 'redness' },
            { id: 'scars', label: '여드름 흉터', value: 'scars' },
            { id: 'dryness', label: '건조 / 속당김', value: 'dryness' },
        ],
    },
    // --- Deep Dive: Pigmentation ---
    {
        id: 'q_pigment_type',
        category: 'Specific',
        title: '색소의 형태가 어떤가요?',
        type: 'single',
        condition: (answers) => answers.q1_concerns?.includes('pigmentation'),
        options: [
            { id: 'mist', label: '안개처럼 넓게 퍼짐 (기미)', value: 'mist' },
            { id: 'spot', label: '경계가 뚜렷한 점 (주근깨/잡티)', value: 'spot' },
            { id: 'pih', label: '여드름 후 검은 자국 (색소침착)', value: 'pih' },
            { id: 'dull', label: '전반적으로 칙칙한 피부톤', value: 'dull' },
        ]
    },
    // --- Deep Dive: Redness ---
    {
        id: 'q_redness_type',
        category: 'Specific',
        title: '붉은기가 언제 가장 심한가요?',
        type: 'single',
        condition: (answers) => answers.q1_concerns?.includes('redness'),
        options: [
            { id: 'acne_red', label: '여드름과 함께 붉음', value: 'acne_red' },
            { id: 'flush', label: '열감/감정 변화 시 홍조', value: 'flush' },
            { id: 'veins', label: '실핏줄이 보임', value: 'veins' },
        ]
    },
    // --- Deep Dive: Acne ---
    {
        id: 'q_acne_state',
        category: 'Specific',
        title: '현재 여드름 상태는 어떤가요?',
        type: 'single',
        condition: (answers) => answers.q1_concerns?.includes('acne'),
        options: [
            { id: 'comedonal', label: '좁쌀 여드름 (오돌토돌)', value: 'comedonal' },
            { id: 'inflammatory', label: '화농성 여드름 (붉고 아픔)', value: 'inflammatory' },
            { id: 'scars_pores', label: '흉터와 모공 위주', value: 'scars_pores' },
        ]
    },
    // --- General Constraints ---
    {
        id: 'q2_skin_type',
        category: 'General',
        title: '피부 타입은 어떠신가요?',
        type: 'single',
        options: [
            { id: 'oily', label: '지성', value: 'oily', description: '하루 종일 번들거림' },
            { id: 'dry', label: '건성', value: 'dry', description: '당김이 심하고 각질이 일어남' },
            { id: 'combination', label: '복합성', value: 'combination', description: 'T존은 지성, U존은 건성' },
            { id: 'sensitive', label: '민감성', value: 'sensitive', description: '자극에 약하고 쉽게 붉어짐' },
            { id: 'normal', label: '중성', value: 'normal', description: '특별한 문제 없음' },
        ],
    },
    // --- Detailed Budget (Full Mode) ---
    {
        id: 'q_budget_granular',
        category: 'Constraints',
        title: '1회 시술 희망 예산은?',
        type: 'single',
        modes: ['full', 'pro'],
        options: [
            { id: 'under_100', label: '10만원 미만', value: 'under_100' },
            { id: '100_300', label: '10만원 ~ 30만원', value: '100_300' },
            { id: '300_500', label: '30만원 ~ 50만원', value: '300_500' },
            { id: '500_1000', label: '50만원 ~ 100만원', value: '500_1000' },
            { id: 'over_1000', label: '100만원 이상', value: 'over_1000' },
            { id: 'any', label: '상담 후 결정 (유동적)', value: 'any' },
        ]
    },
    // --- Simple Budget (Light Mode) ---
    {
        id: 'q_budget',
        category: 'Constraints',
        title: '1회 시술 희망 예산은?',
        type: 'single',
        modes: ['light'],
        options: [
            { id: 'economy', label: '20만원 미만', value: 'economy' },
            { id: 'standard', label: '20만원 ~ 40만원', value: 'standard' },
            { id: 'premium', label: '40만원 이상', value: 'premium' },
        ]
    },
    // --- Total Budget (New) ---
    {
        id: 'q_total_budget',
        category: 'Constraints',
        title: '전체 시술 계획에 대한 총 예산은 어느 정도인가요?',
        subtitle: '모든 회차 포함',
        type: 'single',
        modes: ['light'],
        options: [
            { id: 'under_50', label: '50만원 미만', value: 'under_50' },
            { id: '50_100', label: '50만원 ~ 100만원', value: '50_100' },
            { id: '100_200', label: '100만원 ~ 200만원', value: '100_200' },
            { id: 'over_200', label: '200만원 이상', value: 'over_200' },
            { id: 'flexible', label: '상담 후 결정 (유동적)', value: 'flexible' },
        ]
    },
    // --- Detailed History & Conditions (Full Mode) ---
    {
        id: 'q3_history',
        category: 'History',
        title: '최근 6개월 내 피부 시술 경험이 있으신가요?',
        type: 'single',
        options: [
            { id: 'yes', label: '예', value: 'yes' },
            { id: 'no', label: '아니오', value: 'no' },
        ],
    },
    {
        id: 'q_medication',
        category: 'Medical',
        title: '현재 복용 중인 약물이 있나요?',
        subtitle: '특히 여드름 약, 혈액응고제 등',
        type: 'multiple',
        modes: ['full', 'pro'],
        options: [
            { id: 'none', label: '없음', value: 'none' },
            { id: 'isotretinoin', label: '여드름 약 (이소트레티노인/로아큐탄)', value: 'isotretinoin' },
            { id: 'aspirin', label: '아스피린 / 항응고제', value: 'aspirin' },
            { id: 'hormone', label: '호르몬제', value: 'hormone' },
            { id: 'other', label: '기타', value: 'other' },
        ]
    },
    {
        id: 'q_condition',
        category: 'Medical',
        title: '다음 중 해당되는 사항이 있나요?',
        type: 'multiple',
        modes: ['full', 'pro'],
        options: [
            { id: 'none', label: '없음', value: 'none' },
            { id: 'pregnancy', label: '임신 / 수유 중', value: 'pregnancy' },
            { id: 'keloid', label: '켈로이드성 피부', value: 'keloid' },
            { id: 'metal_implant', label: '얼굴 내 금속 보형물', value: 'metal_implant' },
        ]
    },
    {
        id: 'q_downtime',
        category: 'Constraints',
        title: '감수 가능한 회복 기간(다운타임)은?',
        type: 'single',
        options: [
            { id: 'none', label: '없음 (즉시 일상생활 가능)', value: 'none' },
            { id: 'weekend', label: '주말 정도 (2-3일 붉은기)', value: 'weekend' },
            { id: 'week', label: '1주일 (딱지/각질 가능)', value: 'week' },
        ]
    },
];
