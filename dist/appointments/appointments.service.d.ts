import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';
export declare class AppointmentsService {
    private appointmentRepository;
    private doctorsService;
    constructor(appointmentRepository: Repository<Appointment>, doctorsService: DoctorsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(status?: string, doctorId?: number, date?: string): Promise<Appointment[]>;
    findOne(id: number): Promise<Appointment>;
    update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    cancel(id: number): Promise<Appointment>;
    getStatistics(): Promise<{
        total: number;
        today: number;
        booked: number;
        completed: number;
        canceled: number;
    }>;
}
