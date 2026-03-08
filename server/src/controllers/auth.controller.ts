import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function signup(req: Request, res: Response): Promise<void> {
    try {
        const { email, password, name, phone } = req.body;

        // Basic validation
        if (!email || !password || !name) {
            res.status(400).json({ error: 'Email, password, and name are required.' });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters.' });
            return;
        }

        const result = await authService.signup({ email, password, name, phone });

        res.status(201).json({
            message: 'Account created successfully.',
            user: result.user,
            token: result.token,
        });
    } catch (err: any) {
        if (err.message.includes('already exists')) {
            res.status(409).json({ error: err.message });
            return;
        }
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }

        const result = await authService.login({ email, password });

        res.json({
            message: 'Login successful.',
            user: result.user,
            token: result.token,
        });
    } catch (err: any) {
        if (err.message.includes('Invalid email')) {
            res.status(401).json({ error: err.message });
            return;
        }
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function getMe(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required.' });
            return;
        }

        const user = await authService.getUserById(req.user.userId);

        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        res.json({ user });
    } catch (err) {
        console.error('GetMe error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function updateMe(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required.' });
            return;
        }

        const { name, phone } = req.body;
        const user = await authService.updateUser(req.user.userId, { name, phone });

        res.json({
            message: 'Profile updated.',
            user,
        });
    } catch (err: any) {
        console.error('UpdateMe error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
