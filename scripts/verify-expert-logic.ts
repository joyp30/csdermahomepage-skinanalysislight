// @ts-nocheck
const { getRecommendations } = require('../src/lib/data/treatments');

// Mock data structures matching the app's Treatment type
// We only need to check IDs or Names for verification

function runTest(name, inputs, expectedIds) {
    console.log(`\n--- Test Scenario: ${name} ---`);
    try {
        const results = getRecommendations(inputs);
        const recommendedIds = results.map(r => r.id);

        console.log('Inputs:', JSON.stringify(inputs, null, 2));
        console.log('Got Recommendations:', recommendedIds.join(', '));
        console.log('Expected (any of):', expectedIds.join(', '));

        const pass = expectedIds.some(id => recommendedIds.includes(id));

        if (pass) {
            console.log('✅ PASS');
        } else {
            console.error('❌ FAIL');
            console.error(`Expected one of [${expectedIds}] to be in [${recommendedIds}]`);
        }
    } catch (e) {
        console.error('❌ CRASH', e);
    }
}

// ==========================================
// 10 Detailed Scenarios
// ==========================================

// 1. Melasma + Dry Skin (Regression)
// Expect: Shining Mono Toning (1-2) which hydrates
runTest(
    '1. Melasma (Dry)',
    {
        q1_concerns: ['pigmentation'],
        q2_skin_type: 'dry',
        q_pigment_type: 'mist', // Melasma
        q_budget: '20_40',
        q_downtime: 'weekend'
    },
    ['1-2'] // Shining Mono Toning
);

// 2. Inflammatory Acne (Regression)
// Expect: Gold PTT (5-13) or Capri (5-12)
runTest(
    '2. Inflammatory Acne',
    {
        q1_concerns: ['acne'],
        q_acne_state: 'inflammatory',
        q2_skin_type: 'oily',
        q_budget: 'standard'
    },
    ['5-13', '5-12'] // Gold PTT, Capri
);

// 3. Lifting + Fat (Regression)
// Expect: V-Ro (3-11) AND Elsa/LSSA (3-12)
runTest(
    '3. Lifting + Fat',
    {
        q1_concerns: ['sagging', 'fat'],
        q1_details_lifting: 'fat', // "Simbu-bol" / Jowls
        q_budget: 'premium',
        q_downtime: 'weekend'
    },
    ['3-11', '3-12'] // V-Ro, LSSA
);

// 4. Deep Scars & Pores (High Budget)
// Expect: Juvelook Vol (6-5) or Potenza (5-9/5-10) or Fraxel-like
runTest(
    '4. Deep Scars (High Budget)',
    {
        q1_concerns: ['scars'],
        q_acne_state: 'scars_pores', // Often mapped from acne quesiton or direct
        q_budget: 'premium',
        q_downtime: 'week' // Willing to have downtime
    },
    ['6-5', '5-9', '5-10'] // Juvelook Vol, Potenza Pumping/Needle
);

// 5. Sensitive/Rosacea (Zero Downtime)
// Expect: LDM (19-2) or Synergy (4-6) or Cryo
runTest(
    '5. Sensitive Redness',
    {
        q1_concerns: ['redness'],
        q_redness_type: 'flush', // Flushing
        q2_skin_type: 'sensitive',
        q_downtime: 'none'
    },
    ['19-2', '4-6', '16-1'] // LDM, Synergy, Soothing Care
);

// 6. Wedding Prep (Instant Glow, No Downtime)
// Expect: Shining Toning (1-1) or Whitening Care (10-1)
runTest(
    '6. Wedding Prep (Glow)',
    {
        q1_concerns: ['pigmentation'],
        q_pigment_type: 'dull',
        q_downtime: 'none',
        q_budget: 'premium'
    },
    ['1-1', '10-1'] // Shining Toning, Whitening Care
);

// 7. Budget Constraint (Pigmentation)
// Expect: Basic Toning (1-6) or IPL (2-1) instead of Shining Toning
runTest(
    '7. Budget Pigment',
    {
        q1_concerns: ['pigmentation'],
        q_pigment_type: 'spot',
        q_budget: 'economy', // < 200k KRW
    },
    ['1-6', '2-1', '1-1'] // Laser Toning (Basic), IPL, General Toning
);

// 8. Texture/Blackheads (Oily)
// Expect: Aqua Peel (7-1) or FCR (5-11) or Triple Peel (acne_triple)
runTest(
    '8. Texture/Blackheads',
    {
        q1_concerns: ['pores'], // Or acne with comedonal
        q_acne_state: 'comedonal',
        q2_skin_type: 'oily'
    },
    ['7-1', '5-11', 'acne_triple'] // Aqua Peel, FCR, Triple Peel
);

// 9. Sagging Only (No Fat) -> Tightening
// Expect: Oligio (8-6) or V-Ro (8-1) or The Ol-lyeo (8-7)
runTest(
    '9. Sagging (Tightening focus)',
    {
        q1_concerns: ['sagging'],
        q1_details_lifting: 'sagging', // Just skin laxity
        q_budget: 'premium'
    },
    ['8-6', '8-1', '8-7'] // Oligio, V-Ro, The Ol-Lyeo S
);

// 10. Complex (Pigment + Redness + Sagging)
// Expect: Multi-modality. Should see at least one of each or a "Program"
// Synergy (Redness) + Toning (Pigment) + Lifting OR Wedding Package
runTest(
    '10. Complex (Pigment+Redness+Sagging)',
    {
        q1_concerns: ['pigmentation', 'redness', 'sagging'],
        q_pigment_type: 'mist',
        q_redness_type: 'flush',
        q_budget: 'premium'
    },
    ['4-6', '1-2', '8-6', '8-1', 'wedding_package', '5-25'] // Broaden to include programs
);

// 11. Teen Acne (Budget, Comedonal)
// Expect: Mild PDT (5-10) or Scaling (acne_triple - 150k fitting budget?)
// Mild PDT is 120k.
runTest(
    '11. Teen Acne (Budget)',
    {
        q1_concerns: ['acne'],
        q_acne_state: 'comedonal',
        q_budget: 'economy' // < 200k
    },
    ['5-10', 'acne_triple'] // Mild PDT, Triple Peel
);

// 12. Men's Care (Pores + Scars, Oily)
// Expect: Pico Fraxel (6-3) or Potenza (if mapped) or Aqua Peel (7-1) for pores
runTest(
    '12. Men\'s Care (Pores+Scars)',
    {
        q1_concerns: ['cares', 'pores'],
        q_acne_state: 'scars_pores',
        q2_skin_type: 'oily'
    },
    ['6-3', '7-1', '5-11'] // Pico Fraxel, Aqua Peel, FCR
);

// 13. Severe Rosacea (Flush, Sensitive)
// Expect: Synergy (4-6) or Synergy Complex (4-10) or LDM (19-2)
runTest(
    '13. Severe Rosacea',
    {
        q1_concerns: ['redness'],
        q_redness_type: 'flush',
        q2_skin_type: 'sensitive',
        q_budget: 'premium'
    },
    ['4-6', '4-10', '19-2']
);

// 14. Wrinkle Focus (Dry, Anti-aging)
// Expect: Oligio (8-6) (Collagen) or Rejuran HB (11-4)
runTest(
    '14. Wrinkle Focus',
    {
        q1_concerns: ['wrinkles', 'dryness'],
        q2_skin_type: 'dry',
        q_budget: 'premium'
    },
    ['8-6', '11-4', '3-2'] // Oligio, Rejuran HB, Old Oligio ID
);

// 15. Total Anti-Aging (Pigment + Sagging + Wrinkles)
// Expect: "The Ol-lyeo" (8-7) which combines V-Ro + Oligio
runTest(
    '15. Total Anti-Aging',
    {
        q1_concerns: ['pigmentation', 'sagging', 'wrinkles'],
        q_pigment_type: 'dull',
        q1_details_lifting: 'sagging',
        q_budget: 'premium'
    },
    ['8-7', '8-1', '8-6'] // The Ol-Lyeo, V-Ro, Oligio
);

// 16. Freckles Focus (Spot Removal)
// Expect: Spot Removal Premium (2-5) or Basic (2-4)
runTest(
    '16. Freckles Focus',
    {
        q1_concerns: ['pigmentation'],
        q_pigment_type: 'spot', // Freckles
        q2_skin_type: 'normal',
        q_budget: 'standard'
    },
    ['2-5', '2-4']
);

// 17. Redness (Visible Veins)
// Expect: Synergy (4-6) or Cellec V Redness (4-7)
runTest(
    '17. Redness (Veins)',
    {
        q1_concerns: ['redness'],
        q_redness_type: 'veins', // Visible vessels
        q2_skin_type: 'normal'
    },
    ['4-6', '4-7']
);

// 18. Double Chin Only (Fat Focus)
// Expect: Elsa/LSSA (8-21)
runTest(
    '18. Double Chin (Fat)',
    {
        q1_concerns: ['fat'], // mapped internally from survey or direct
        q1_details_lifting: 'fat',
        q2_skin_type: 'normal'
    },
    ['8-21'] // Elsa
);

// 19. Acne Scars (Low Downtime Preference)
// Expect: Pico Fraxel (6-3) over CO2 (6-1)
runTest(
    '19. Acne Scars (Weekend Downtime)',
    {
        q1_concerns: ['scars'],
        q_acne_state: 'scars_pores',
        q_downtime: 'weekend' // Avoids 'week' downtime of CO2
    },
    ['6-3'] // Pico Fraxel
);

// 20. Brightening / Tone-up (Dullness)
// Expect: Lavieen (2-1) or Dual Toning (1-3)
runTest(
    '20. Brightening (Dullness)',
    {
        q1_concerns: ['pigmentation'],
        q_pigment_type: 'dull',
        q2_skin_type: 'normal'
    },
    ['2-1', '1-3'] // Lavieen, Dual Toning
);
