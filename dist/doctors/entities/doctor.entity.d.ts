import { Appointment } from '../../appointments/entities/appointment.entity';
export declare class Doctor {
    id: number;
    name: string;
    specialization: string;
    gender: string;
    location: string;
    availability: string;
    isActive: boolean;
    appointments: Appointment[];
    createdAt: Date;
    updatedAt: Date;
}
