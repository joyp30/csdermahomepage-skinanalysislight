import { db } from '../src/db';
import { users, surveys } from '../src/db/schema';

async function seed() {
    // 1. Create User
    const user = await db.insert(users).values({
        name: 'Booking Test User',
        phone: '010-8888-7777',
        role: 'patient'
    }).returning().get();

    // 2. Create Survey
    const survey = await db.insert(surveys).values({
        patientId: user.id,
        concerns: JSON.stringify(['pigmentation']),
        skinType: 'normal',
        answers: JSON.stringify({ 'pigmentation': 'spots' }),
        status: 'completed'
    }).returning().get();

    console.log('SURVEY_ID=' + survey.id);
}

seed();
