"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_entity_1 = require("./entities/doctor.entity");
let DoctorsService = class DoctorsService {
    constructor(doctorRepository) {
        this.doctorRepository = doctorRepository;
    }
    async create(createDoctorDto) {
        try {
            const doctor = this.doctorRepository.create(createDoctorDto);
            return await this.doctorRepository.save(doctor);
        }
        catch (error) {
            throw new Error('Failed to create doctor');
        }
    }
    async findAll(specialization, location) {
        try {
            const where = { isActive: true };
            if (specialization) {
                where.specialization = (0, typeorm_2.Like)(`%${specialization}%`);
            }
            if (location) {
                where.location = (0, typeorm_2.Like)(`%${location}%`);
            }
            return await this.doctorRepository.find({ where });
        }
        catch (error) {
            throw new Error('Failed to fetch doctors');
        }
    }
    async findOne(id) {
        try {
            const doctor = await this.doctorRepository.findOne({ where: { id } });
            if (!doctor) {
                throw new common_1.NotFoundException(`Doctor with ID ${id} not found`);
            }
            return doctor;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to fetch doctor');
        }
    }
    async update(id, updateDoctorDto) {
        try {
            const doctor = await this.findOne(id);
            Object.assign(doctor, updateDoctorDto);
            return await this.doctorRepository.save(doctor);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to update doctor');
        }
    }
    async remove(id) {
        try {
            const doctor = await this.findOne(id);
            doctor.isActive = false;
            await this.doctorRepository.save(doctor);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to delete doctor');
        }
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map