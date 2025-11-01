// src/doctors/doctors.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      const doctor = this.doctorRepository.create(createDoctorDto);
      return await this.doctorRepository.save(doctor);
    } catch (error) {
      throw new Error('Failed to create doctor');
    }
  }

  async findAll(specialization?: string, location?: string): Promise<Doctor[]> {
    try {
      const where: any = { isActive: true };

      if (specialization) {
        where.specialization = Like(`%${specialization}%`);
      }

      if (location) {
        where.location = Like(`%${location}%`);
      }

      return await this.doctorRepository.find({ where });
    } catch (error) {
      throw new Error('Failed to fetch doctors');
    }
  }

  async findOne(id: number): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });

      if (!doctor) {
        throw new NotFoundException(`Doctor with ID ${id} not found`);
      }

      return doctor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch doctor');
    }
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    try {
      const doctor = await this.findOne(id);
      Object.assign(doctor, updateDoctorDto);
      return await this.doctorRepository.save(doctor);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update doctor');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const doctor = await this.findOne(id);
      doctor.isActive = false;
      await this.doctorRepository.save(doctor);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete doctor');
    }
  }
}