import { Doctor } from '../../doctors/entities/doctor.entity';
export declare class Appointment {
    id: number;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    doctorId: number;
    doctor: Doctor;
    appointmentDate: Date;
    status: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
