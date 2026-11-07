export type EntityId = string;

export type UserRole = 'admin' | 'doctor' | 'assistant';
export type VisitStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'insurance';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface User {
    id: EntityId;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    password_hash: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Patient {
    id: EntityId;
    first_name: string;
    last_name: string;
    phone: string;
    birth_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: EntityId;
    name: string;
    description: string | null;
    code: string | null;
    price: number;
    duration: number;
    created_at: string;
    updated_at: string;
}

export interface Visit {
    id: EntityId;
    patient_id: EntityId;
    doctor_id: EntityId | null;
    start_time: string;
    end_time: string;
    status: VisitStatus;
    created_at: string;
    updated_at: string;
}

export interface VisitService {
    id: EntityId;
    visit_id: EntityId;
    service_id: EntityId;
    quantity: number;
    price_at_time: number;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: EntityId;
    visit_id: EntityId;
    amount: number;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    created_at: string;
    updated_at: string;
}
