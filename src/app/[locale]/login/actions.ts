'use server';

import { cookies } from 'next/headers';

export async function login(password: string) {
    // Hardcoded password for demo purposes. Ideally use ENV var.
    const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || '1234';

    if (password === CORRECT_PASSWORD) {
        const cookieStore = await cookies();
        // Set cookie for 1 day
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/'
        });
        return { success: true };
    }

    return { success: false };
}
