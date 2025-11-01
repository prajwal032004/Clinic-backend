export declare class CreateAppointmentDto {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    doctorId: number;
    appointmentDate: string;
    notes?: string;
}
export declare class UpdateAppointmentDto {
    patientName?: string;
    patientPhone?: string;
    patientEmail?: string;
    doctorId?: number;
    appointmentDate?: string;
    status?: string;
    notes?: string;
}
