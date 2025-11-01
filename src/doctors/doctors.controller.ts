// src/doctors/doctors.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    try {
      return await this.doctorsService.create(createDoctorDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('specialization') specialization?: string,
    @Query('location') location?: string,
  ) {
    try {
      return await this.doctorsService.findAll(specialization, location);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.doctorsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    try {
      return await this.doctorsService.update(+id, updateDoctorDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.doctorsService.remove(+id);
      return { message: 'Doctor deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}