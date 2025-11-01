import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
export declare class DoctorsService {
    private doctorRepository;
    constructor(doctorRepository: Repository<Doctor>);
    create(createDoctorDto: CreateDoctorDto): Promise<Doctor>;
    findAll(specialization?: string, location?: string): Promise<Doctor[]>;
    findOne(id: number): Promise<Doctor>;
    update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor>;
    remove(id: number): Promise<void>;
}
