import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    create(createDoctorDto: CreateDoctorDto): Promise<import("./entities/doctor.entity").Doctor>;
    findAll(specialization?: string, location?: string): Promise<import("./entities/doctor.entity").Doctor[]>;
    findOne(id: string): Promise<import("./entities/doctor.entity").Doctor>;
    update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<import("./entities/doctor.entity").Doctor>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
