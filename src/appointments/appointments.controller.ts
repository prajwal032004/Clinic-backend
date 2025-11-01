import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      return await this.appointmentsService.create(createAppointmentDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('doctorId') doctorId?: string,
    @Query('date') date?: string,
  ) {
    try {
      return await this.appointmentsService.findAll(
        status,
        doctorId ? +doctorId : undefined,
        date,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('statistics')
  async getStatistics() {
    try {
      return await this.appointmentsService.getStatistics();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.appointmentsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    try {
      return await this.appointmentsService.update(+id, updateAppointmentDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    try {
      return await this.appointmentsService.cancel(+id);
    } catch (error) {
      throw error;
    }
  }
}