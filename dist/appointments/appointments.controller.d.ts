import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./entities/appointment.entity").Appointment>;
    findAll(status?: string, doctorId?: string, date?: string): Promise<import("./entities/appointment.entity").Appointment[]>;
    getStatistics(): Promise<{
        total: number;
        today: number;
        booked: number;
        completed: number;
        canceled: number;
    }>;
    findOne(id: string): Promise<import("./entities/appointment.entity").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("./entities/appointment.entity").Appointment>;
    cancel(id: string): Promise<import("./entities/appointment.entity").Appointment>;
}
