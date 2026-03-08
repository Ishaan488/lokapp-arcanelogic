export interface User {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: 'CITIZEN' | 'OFFICIAL' | 'ADMIN';
    department_id: string | null;
    created_at?: string;
}

export interface Report {
    id: string;
    reporter_id: string;
    title: string | null;
    description: string;
    language: string;
    image_url: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    category_id: string | null;
    department_id: string | null;
    status: 'PENDING' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    ai_analysis: any;
    upvote_count: number;
    etr: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
}

export interface Department {
    id: string;
    name: string;
    description: string | null;
}

export interface Category {
    id: string;
    name: string;
    description: string | null;
}
