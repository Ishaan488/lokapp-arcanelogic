import bcrypt from 'bcrypt';
import pool from '../db/pool';
import { generateToken, JwtPayload } from '../utils/jwt';

const SALT_ROUNDS = 10;

export interface SignupInput {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResult {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        phone: string | null;
        department_id: string | null;
    };
    token: string;
}

export async function signup(input: SignupInput): Promise<AuthResult> {
    const { email, password, name, phone } = input;

    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        throw new Error('A user with this email already exists.');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, phone, role)
     VALUES ($1, $2, $3, $4, 'CITIZEN')
     RETURNING id, email, name, phone, role, department_id`,
        [email, passwordHash, name, phone || null]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return { user, token };
}

export async function login(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;

    // Find user
    const result = await pool.query(
        'SELECT id, email, password_hash, name, phone, role, department_id FROM users WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error('Invalid email or password.');
    }

    const user = result.rows[0];

    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw new Error('Invalid email or password.');
    }

    // Generate JWT
    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    // Remove password_hash from returned user
    const { password_hash, ...safeUser } = user;

    return { user: safeUser, token };
}

export async function getUserById(userId: string) {
    const result = await pool.query(
        'SELECT id, email, name, phone, role, department_id, created_at FROM users WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

export async function updateUser(userId: string, updates: { name?: string; phone?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
        fields.push(`name = $${paramIndex++}`);
        values.push(updates.name);
    }
    if (updates.phone) {
        fields.push(`phone = $${paramIndex++}`);
        values.push(updates.phone);
    }

    if (fields.length === 0) {
        throw new Error('No fields to update.');
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, phone, role, department_id`,
        values
    );

    return result.rows[0];
}
