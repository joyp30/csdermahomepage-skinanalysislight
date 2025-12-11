// @ts-nocheck
const { getRecommendations } = require('../src/lib/data/treatments');

// ----------------------------------------------------------------------
// Helper to mimic LightConsultationPage logic
// ----------------------------------------------------------------------
function getLightModeInputs(baseInputs) {
    return {
        ...baseInputs,
        q_downtime: 'weekend',
        q_pigment_type: baseInputs.q1_concerns.includes('pigmentation') ? 'spot' : undefined,
    };
}

function runTest(idx, name, baseInputs, expectedIds) {
    const inputs = getLightModeInputs(baseInputs);
    // console.log(`\n--- [${idx}] ${name} ---`);
    let status = '❌ FAIL';
    let output = '';

    try {
        const results = getRecommendations(inputs);
        const topRec = results[0]; // Light mode focuses on Top Rec

        if (!topRec) {
            output = `No result found. Inputs: ${JSON.stringify(inputs)}`;
            console.log(`| ${idx} | ${name} | ${baseInputs.q1_concerns.join(', ')} | ${baseInputs.q_budget} | None | ${status} |`);
            return;
        }

        const pass = expectedIds.length === 0 || expectedIds.includes(topRec.id);
        status = pass ? '✅ PASS' : '❌ FAIL';

        // Format for table: | ID | Scenario | Concerns | Budget | Result | Status |
        console.log(`| ${idx} | ${name} | ${baseInputs.q1_concerns.join(', ')}/ ${baseInputs.q2_skin_type} | ${baseInputs.q_budget} | ${topRec.name} (ID:${topRec.id}) | ${status} |`);

        if (!pass) {
            // console.error(`   Expected: [${expectedIds.join(', ')}], Got: ${topRec.id} (${topRec.name})`);
        }

    } catch (e) {
        console.error('❌ CRASH', e);
    }
}

console.log('| # | Scenario Name | Inputs (Concern/Skin) | Budget | Top Result | Status |');
console.log('|---|---|---|---|---|---|');

// ----------------------------------------------------------------------
// 20 Light Mode Scenarios
// ----------------------------------------------------------------------

// 1. Pigmentation (Economy) -> Expect IPL or Laser Toning
runTest(1, 'Spot Removal (Cheap)', { q1_concerns: ['pigmentation'], q2_skin_type: 'dry', q_budget: 'economy' }, ['2-1', '1-6', '2-4']);

// 2. Pigmentation (Premium) -> Expect Pico or High-end Toning
runTest(2, 'Spot Removal (Premium)', { q1_concerns: ['pigmentation'], q2_skin_type: 'normal', q_budget: 'premium' }, ['2-5', '1-2', '10-1']);

// 3. Acne (Economy) -> Scaling or Basic Care
runTest(3, 'Acne Basic', { q1_concerns: ['acne'], q2_skin_type: 'oily', q_budget: 'economy' }, ['acne_triple', '5-1', '5-2']);

// 4. Acne (Premium) -> Gold PTT or Capriblu
runTest(4, 'Acne Premium', { q1_concerns: ['acne'], q2_skin_type: 'oily', q_budget: 'premium' }, ['5-13', '5-12', '5-9']);

// 5. Pores (Standard) -> Aqua Peel or Pico
runTest(5, 'Pores Standard', { q1_concerns: ['pores'], q2_skin_type: 'combination', q_budget: 'standard' }, ['7-1', '6-3']);

// 6. Wrinkles (Premium) -> Oligio
runTest(6, 'Anti-Aging Premium', { q1_concerns: ['wrinkles'], q2_skin_type: 'dry', q_budget: 'premium' }, ['8-6', '8-1']);

// 7. Sagging (Standard) -> Shurink or LinearZ
runTest(7, 'Lifting Standard', { q1_concerns: ['sagging'], q2_skin_type: 'normal', q_budget: 'standard' }, ['8-2', '8-4']);

// 8. Redness (Sensitive) -> Synergy or LDM
runTest(8, 'Redness Care', { q1_concerns: ['redness'], q2_skin_type: 'sensitive', q_budget: 'standard' }, ['4-6', '19-2', '16-1']);

// 9. Pigment + Acne (Complex) -> Toning or PDT? (ID checks might be flexible)
runTest(9, 'Pigment+Acne', { q1_concerns: ['pigmentation', 'acne'], q2_skin_type: 'oily', q_budget: 'standard' }, []);

// 10. Sagging + Wrinkles (Premium) -> The Ol-lyeo or V-Ro
runTest(10, 'Total Anti-Aging', { q1_concerns: ['sagging', 'wrinkles'], q2_skin_type: 'dry', q_budget: 'premium' }, ['8-7', '8-1', '8-6']);

// 11. Dryness specific (Economy) -> LDM or Moist Care
runTest(11, 'Dryness Care', { q1_concerns: ['wrinkles'], q2_skin_type: 'dry', q_budget: 'economy' }, ['19-2', '16-1', '13-1']); // default to moisture care

// 12. Oily + Pores (Premium) -> Potenza
runTest(12, 'Oily Pores Premium', { q1_concerns: ['pores'], q2_skin_type: 'oily', q_budget: 'premium' }, ['5-9', '5-10', '6-5']);

// 13. Double Chin (Sagging + Oily?)
// Note: 'fat' is not a Light choice. 'sagging' is.
runTest(13, 'Sagging (Oily)', { q1_concerns: ['sagging'], q2_skin_type: 'oily', q_budget: 'standard' }, ['8-2', '8-4', '3-11']);

// 14. Sensitive + Pigment -> Gentle Toning
runTest(14, 'Sensitive Pigment', { q1_concerns: ['pigmentation'], q2_skin_type: 'sensitive', q_budget: 'standard' }, ['1-1', '1-2']);

// 15. Wedding Prep (Complex)
runTest(15, 'Wedding Prep', { q1_concerns: ['pigmentation', 'wrinkles', 'pores'], q2_skin_type: 'normal', q_budget: 'premium' }, ['wedding_package', '1-1', '10-1']);

// 16. Men's Care (Acne + Pores + Oily)
runTest(16, 'Men\'s Care', { q1_concerns: ['acne', 'pores'], q2_skin_type: 'oily', q_budget: 'standard' }, ['5-10', '5-5', '7-1']);

// 17. Budget Lifting (Economy) -> Shurink is usually cheap?
runTest(17, 'Budget Lifting', { q1_concerns: ['sagging'], q2_skin_type: 'dry', q_budget: 'economy' }, ['8-2', '8-4']);

// 18. Redness + Dry (Premium) -> Synergy Complex
runTest(18, 'Redness Premium', { q1_concerns: ['redness'], q2_skin_type: 'dry', q_budget: 'premium' }, ['4-6', '4-10']);

// 19. Maintenance (Normal Skin, No Concerns? Not possible in UI, pick one)
runTest(19, 'Light Maintenance', { q1_concerns: ['pores'], q2_skin_type: 'normal', q_budget: 'economy' }, ['7-1', '13-1', '16-1']);

// 20. Max Concerns (3 max) + Premium
runTest(20, 'Max Concerns Premium', { q1_concerns: ['pigmentation', 'sagging', 'redness'], q2_skin_type: 'combination', q_budget: 'premium' }, []);
