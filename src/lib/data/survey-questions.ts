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
    {
        id: 'q_budget',
        category: 'Constraints',
        title: 'What is your budget per session?',
        type: 'single',
        options: [
            { id: 'economy', label: 'Under 200,000 KRW', value: 'economy' },
            { id: 'standard', label: '200,000 ~ 400,000 KRW', value: 'standard' },
            { id: 'premium', label: 'Over 400,000 KRW', value: 'premium' },
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
];
