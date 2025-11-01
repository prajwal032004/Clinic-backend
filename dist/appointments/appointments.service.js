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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
const doctors_service_1 = require("../doctors/doctors.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentRepository, doctorsService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorsService = doctorsService;
    }
    async create(createAppointmentDto) {
        try {
            await this.doctorsService.findOne(createAppointmentDto.doctorId);
            const appointment = this.appointmentRepository.create({
                ...createAppointmentDto,
                appointmentDate: new Date(createAppointmentDto.appointmentDate),
                status: 'booked',
            });
            return await this.appointmentRepository.save(appointment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.BadRequestException('Doctor not found');
            }
            throw new Error('Failed to create appointment');
        }
    }
    async findAll(status, doctorId, date) {
        try {
            const where = {};
            if (status) {
                where.status = status;
            }
            if (doctorId) {
                where.doctorId = doctorId;
            }
            if (date) {
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);
                where.appointmentDate = (0, typeorm_2.Between)(startDate, endDate);
            }
            return await this.appointmentRepository.find({
                where,
                relations: ['doctor'],
                order: { appointmentDate: 'ASC' },
            });
        }
        catch (error) {
            throw new Error('Failed to fetch appointments');
        }
    }
    async findOne(id) {
        try {
            const appointment = await this.appointmentRepository.findOne({
                where: { id },
                relations: ['doctor'],
            });
            if (!appointment) {
                throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
            }
            return appointment;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to fetch appointment');
        }
    }
    async update(id, updateAppointmentDto) {
        try {
            const appointment = await this.findOne(id);
            if (updateAppointmentDto.doctorId) {
                await this.doctorsService.findOne(updateAppointmentDto.doctorId);
            }
            if (updateAppointmentDto.appointmentDate) {
                updateAppointmentDto.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
            }
            Object.assign(appointment, updateAppointmentDto);
            return await this.appointmentRepository.save(appointment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to update appointment');
        }
    }
    async cancel(id) {
        try {
            const appointment = await this.findOne(id);
            appointment.status = 'canceled';
            return await this.appointmentRepository.save(appointment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to cancel appointment');
        }
    }
    async getStatistics() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const [total, todayCount, booked, completed, canceled] = await Promise.all([
                this.appointmentRepository.count(),
                this.appointmentRepository.count({
                    where: {
                        appointmentDate: (0, typeorm_2.Between)(today, tomorrow),
                    },
                }),
                this.appointmentRepository.count({ where: { status: 'booked' } }),
                this.appointmentRepository.count({ where: { status: 'completed' } }),
                this.appointmentRepository.count({ where: { status: 'canceled' } }),
            ]);
            return {
                total,
                today: todayCount,
                booked,
                completed,
                canceled,
            };
        }
        catch (error) {
            throw new Error('Failed to fetch statistics');
        }
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        doctors_service_1.DoctorsService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map