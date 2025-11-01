import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private doctorsService: DoctorsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      // Verify doctor exists
      await this.doctorsService.findOne(createAppointmentDto.doctorId);

      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
        status: 'booked',
      });

      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Doctor not found');
      }
      throw new Error('Failed to create appointment');
    }
  }

  async findAll(status?: string, doctorId?: number, date?: string): Promise<Appointment[]> {
    try {
      const where: any = {};

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
        where.appointmentDate = Between(startDate, endDate);
      }

      return await this.appointmentRepository.find({
        where,
        relations: ['doctor'],
        order: { appointmentDate: 'ASC' },
      });
    } catch (error) {
      throw new Error('Failed to fetch appointments');
    }
  }

  async findOne(id: number): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
        relations: ['doctor'],
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      return appointment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch appointment');
    }
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    try {
      const appointment = await this.findOne(id);

      if (updateAppointmentDto.doctorId) {
        await this.doctorsService.findOne(updateAppointmentDto.doctorId);
      }

      if (updateAppointmentDto.appointmentDate) {
        updateAppointmentDto.appointmentDate = new Date(updateAppointmentDto.appointmentDate) as any;
      }

      Object.assign(appointment, updateAppointmentDto);
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update appointment');
    }
  }

  async cancel(id: number): Promise<Appointment> {
    try {
      const appointment = await this.findOne(id);
      appointment.status = 'canceled';
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (error instanceof NotFoundException) {
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
            appointmentDate: Between(today, tomorrow),
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
    } catch (error) {
      throw new Error('Failed to fetch statistics');
    }
  }
}