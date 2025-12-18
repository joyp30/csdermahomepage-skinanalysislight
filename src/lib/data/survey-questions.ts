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
        title: 'What are your main skin concerns?',
        subtitle: 'Select all that apply.',
        type: 'multiple',
        options: [
            { id: 'pigmentation', label: 'Pigmentation / Dark Spots', value: 'pigmentation' },
            { id: 'acne', label: 'Acne / Breakouts', value: 'acne' },
            { id: 'pores', label: 'Enlarged Pores', value: 'pores' },
            { id: 'wrinkles', label: 'Wrinkles / Fine Lines', value: 'wrinkles' },
            { id: 'sagging', label: 'Sagging / Loss of Elasticity', value: 'sagging' },
            { id: 'fat', label: 'Excess Facial Fat', value: 'fat' }, // Added for Lifting Module IV
            { id: 'redness', label: 'Redness / Sensitivity', value: 'redness' },
            { id: 'scars', label: 'Acne Scars', value: 'scars' },
            { id: 'dryness', label: 'Dryness', value: 'dryness' },
        ],
    },
    // --- Deep Dive: Pigmentation ---
    {
        id: 'q_pigment_type',
        category: 'Specific',
        title: 'How does the pigmentation look?',
        type: 'single',
        condition: (answers) => answers.q1_concerns?.includes('pigmentation'),
        options: [
            { id: 'mist', label: 'Widespread like mist (Melasma)', value: 'mist' },
            { id: 'spot', label: 'Distinct spots (Freckles/Age spots)', value: 'spot' },
            { id: 'pih', label: 'Dark spots from acne (PIH)', value: 'pih' },
            { id: 'dull', label: 'Overall dull skin tone', value: 'dull' },
        ]
    },
    // --- Deep Dive: Redness ---
    {
        id: 'q_redness_type',
        category: 'Specific',
        title: 'When is the redness most visible?',
        type: 'single',
        condition: (answers) => answers.q1_concerns?.includes('redness'),
        options: [
            { id: 'acne_red', label: 'With Acne', value: 'acne_red' },
            { id: 'flush', label: 'Heat/Emotion flushing', value: 'flush' },
            { id: 'veins', label: 'Visible blood vessels', value: 'veins' },
        ]
    },
    // --- Deep Dive: Acne ---
    {
        id: 'q_acne_state',
        category: 'Specific',
        title: 'What is your current acne state?',
        type: 'single',
        condition: (answers) => answers.q1_concerns?.includes('acne'),
        options: [
            { id: 'comedonal', label: 'Small bumps (Comedonal)', value: 'comedonal' },
            { id: 'inflammatory', label: 'Red and painful (Inflammatory)', value: 'inflammatory' },
            { id: 'scars_pores', label: 'Mostly scars and pores now', value: 'scars_pores' },
        ]
    },
    // --- General Constraints ---
    {
        id: 'q2_skin_type',
        category: 'General',
        title: 'How would you describe your skin type?',
        type: 'single',
        options: [
            { id: 'oily', label: 'Oily', value: 'oily', description: 'Shiny throughout the day' },
            { id: 'dry', label: 'Dry', value: 'dry', description: 'Tight, flaky, or rough' },
            { id: 'combination', label: 'Combination', value: 'combination', description: 'Oily T-zone, dry cheeks' },
            { id: 'sensitive', label: 'Sensitive', value: 'sensitive', description: 'Reacts easily to products' },
            { id: 'normal', label: 'Normal', value: 'normal', description: 'Balanced, no major issues' },
        ],
    },
    // --- Detailed Budget (Full Mode) ---
    {
        id: 'q_budget_granular',
        category: 'Constraints',
        title: 'What is your preferred budget range per session?',
        type: 'single',
        modes: ['full', 'pro'],
        options: [
            { id: 'under_100', label: 'Under 100,000 KRW', value: 'under_100' },
            { id: '100_300', label: '100,000 ~ 300,000 KRW', value: '100_300' },
            { id: '300_500', label: '300,000 ~ 500,000 KRW', value: '300_500' },
            { id: '500_1000', label: '500,000 ~ 1,000,000 KRW', value: '500_1000' },
            { id: 'over_1000', label: 'Over 1,000,000 KRW', value: 'over_1000' },
            { id: 'any', label: 'Flexible / Proposal Based', value: 'any' },
        ]
    },
    // --- Simple Budget (Light Mode) ---
    {
        id: 'q_budget',
        category: 'Constraints',
        title: 'What is your budget per session?',
        type: 'single',
        modes: ['light'],
        options: [
            { id: 'economy', label: 'Under 200,000 KRW', value: 'economy' },
            { id: 'standard', label: '200,000 ~ 400,000 KRW', value: 'standard' },
            { id: 'premium', label: 'Over 400,000 KRW', value: 'premium' },
        ]
    },
    // --- Detailed History & Conditions (Full Mode) ---
    {
        id: 'q3_history',
        category: 'History',
        title: 'Have you had any skin treatments in the last 6 months?',
        type: 'single',
        options: [
            { id: 'yes', label: 'Yes', value: 'yes' },
            { id: 'no', label: 'No', value: 'no' },
        ],
    },
    {
        id: 'q_medication',
        category: 'Medical',
        title: 'Are you currently taking any medication?',
        subtitle: 'Especially acne medication or blood thinners',
        type: 'multiple',
        modes: ['full', 'pro'],
        options: [
            { id: 'none', label: 'None', value: 'none' },
            { id: 'isotretinoin', label: 'Isotretinoin (Roaccutane)', value: 'isotretinoin' },
            { id: 'aspirin', label: 'Aspirin / Blood Thinners', value: 'aspirin' },
            { id: 'hormone', label: 'Hormone Therapy', value: 'hormone' },
            { id: 'other', label: 'Other', value: 'other' },
        ]
    },
    {
        id: 'q_condition',
        category: 'Medical',
        title: 'Do you have any of the following conditions?',
        type: 'multiple',
        modes: ['full', 'pro'],
        options: [
            { id: 'none', label: 'None', value: 'none' },
            { id: 'pregnancy', label: 'Pregnancy / Breastfeeding', value: 'pregnancy' },
            { id: 'keloid', label: 'Keloid Scarring Tendency', value: 'keloid' },
            { id: 'metal_implant', label: 'Metal Implants (Face)', value: 'metal_implant' },
        ]
    },
    {
        id: 'q_downtime',
        category: 'Constraints',
        title: 'Acceptable downtime?',
        type: 'single',
        options: [
            { id: 'none', label: 'None (Immediate daily life)', value: 'none' },
            { id: 'weekend', label: 'Weekend (2-3 days redness)', value: 'weekend' },
            { id: 'week', label: '1 Week (Scabs/Peeling OK)', value: 'week' },
        ]
    },
];
