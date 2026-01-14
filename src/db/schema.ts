import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    phone: text('phone'), // Identification
    birthDate: text('birth_date'), // YYYY-MM-DD
    email: text('email'),
    role: text('role').default('patient'), // 'admin', 'staff', 'patient'
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const surveys = sqliteTable('surveys', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patientId: integer('patient_id'), // Can be null if anonymous
    concerns: text('concerns'), // JSON string of selected concerns
    answers: text('answers'), // JSON string of full answers (Deep Dive)
    skinType: text('skin_type'),
    images: text('images'), // JSON string of image paths
    recommendations: text('recommendations'), // JSON result
    status: text('status').default('pending'), // 'pending', 'reviewed', 'completed'
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const leads = sqliteTable('leads', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    source: text('source').default('light_mode'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const bookings = sqliteTable('bookings', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patientId: integer('patient_id'),
    treatmentId: text('treatment_id'),
    treatmentName: text('treatment_name'),
    date: text('date'), // YYYY-MM-DD
    time: text('time'), // HH:mm
    status: text('status').default('confirmed'), // 'pending', 'confirmed', 'cancelled'
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
