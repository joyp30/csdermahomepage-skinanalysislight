import { TREATMENTS, Treatment } from '../data/treatments';

type Answers = {
    q1_concerns?: string[];
    q_pigment_type?: string;
    q_acne_state?: string;
    q2_skin_type?: string;
    q_budget_granular?: string; // Full Mode
    q_budget?: string; // Light Mode
    q_downtime?: string;
    q3_history?: string;
    q_medication?: string[];
    q_condition?: string[];
};

export function calculateScore(treatment: Treatment, answers: Answers): number {
    let score = 0;
    const concerns = answers.q1_concerns || [];
    const skinType = answers.q2_skin_type || 'normal';
    const downtime = answers.q_downtime || 'weekend';
    const conditions = answers.q_condition || [];
    const medications = answers.q_medication || [];

    // --- 0. Safety Checks (Medical Exclusion) ---
    // Isotretinoin -> NO ablative lasers (Fraxis, CO2) or heavy peeling
    if (medications.includes('isotretinoin')) {
        if (['fraxis', 'erbium-fraxel', 'co2'].some(id => treatment.id.includes(id))) return -100;
        if (treatment.category === 'Acne' && treatment.id.includes('peel')) return -50; // Caution with peels
    }

    // Pregnancy -> NO laser, NO injections usually (consultation needed, but for safety filter out strong stuff?)
    // Let's exclude everything except LDM/Oxygen for pregnancy.
    if (conditions.includes('pregnancy')) {
        // Safe list: LDM, Oxygen, Aqua Peel
        const safeIds = ['ldm', 'sonocare', 'oxygen', 'aquapeel', 'whitening'];
        // Check if treatment ID contains any of the safe keywords
        const isSafe = safeIds.some(safe => treatment.id.includes(safe));

        if (!isSafe) {
            return -100;
        } else {
            // Boost safe options so they appear even if concerns don't perfectly align
            score += 50;
        }
    }

    // Keloid -> NO deep needle/injury
    if (conditions.includes('keloid')) {
        if (['fraxis', 'potenza', 'needle', 'injection'].some(id => treatment.id.includes(id) || treatment.description.includes('needle'))) {
            return -100;
        }
    }

    // --- 1. Primary Concern Matching ---
    if (concerns.includes('pigmentation') && treatment.category === 'Pigmentation') score += 10;
    if (concerns.includes('acne') && treatment.category === 'Acne') score += 10;
    if (concerns.includes('redness') && treatment.category === 'Redness') score += 10;
    if ((concerns.includes('wrinkles') || concerns.includes('sagging')) && treatment.category === 'Lifting') score += 10;
    if ((concerns.includes('pores') || concerns.includes('scars')) && treatment.category === 'Scars') score += 10;

    // --- 2. Program Prioritization (The "Tablet App" Logic) ---
    // If it's a Program AND matches a concern, huge boost.
    if (treatment.category === 'Program') {
        if (treatment.id.includes('acne') && concerns.includes('acne')) score += 15;
        if (treatment.id.includes('wedding') && concerns.length >= 2) score += 15; // General boost for multi-concern
        if (treatment.id.includes('whitening') && concerns.includes('pigmentation')) score += 15;
    }

    // --- 3. Budget Filter (Granular) ---
    const budget = answers.q_budget_granular;
    // Note: Treatment prices are currently strings "Consultation" or numbers in logic?
    // In `treatments.ts` from consumption-app, price is String "Consultation".
    // We need a numeric map or assume everything is "Consultation" for now.
    // If we want budget logic, we need estimated prices.
    // For now, if budget is "under_100", exclude high-end programs.
    if (budget === 'under_100') {
        if (treatment.category === 'Program' || ['oligio', 'titanium', 'thermage'].includes(treatment.id)) {
            score -= 50;
        }
    }

    // --- 4. Downtime Filter ---
    if (downtime === 'none') {
        if (treatment.downtime.toLowerCase().includes('scab') || treatment.downtime.toLowerCase().includes('week')) {
            score -= 20;
        }
    }

    return score;
}

export function getRecommendations(answers: Answers): Treatment[] {
    const scored = TREATMENTS.map(t => ({
        treatment: t,
        score: calculateScore(t, answers)
    }));

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    // Return top 3 unique relevant
    return scored.filter(s => s.score > 0).map(s => s.treatment).slice(0, 3);
}
