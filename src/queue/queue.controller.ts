import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto, UpdateQueueDto } from './dto/queue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  async create(@Body() createQueueDto: CreateQueueDto) {
    try {
      return await this.queueService.create(createQueueDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('date') date?: string,
    @Query('status') status?: string,
  ) {
    try {
      return await this.queueService.findAll(date, status);
    } catch (error) {
      throw error;
    }
  }

  @Get('statistics')
  async getStatistics(@Query('date') date?: string) {
    try {
      return await this.queueService.getStatistics(date);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.queueService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateQueueDto: UpdateQueueDto) {
    try {
      return await this.queueService.update(+id, updateQueueDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      return await this.queueService.updateStatus(+id, status);
    } catch (error) {
      throw error;
    }
  }
}