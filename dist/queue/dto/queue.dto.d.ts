export declare class CreateQueueDto {
    patientName: string;
    patientPhone: string;
    appointmentId?: number;
    notes?: string;
}
export declare class UpdateQueueDto {
    status?: string;
    notes?: string;
}
