import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './entities/queue.entity';
import { CreateQueueDto, UpdateQueueDto } from './dto/queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
  ) {}

  private generateQueueNumber(count: number): string {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const number = String(count + 1).padStart(3, '0');
    return `Q${dateStr}-${number}`;
  }

  async create(createQueueDto: CreateQueueDto): Promise<Queue> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const todayCount = await this.queueRepository.count({
        where: { queueDate: today },
      });

      const queueNumber = this.generateQueueNumber(todayCount);

      const queue = this.queueRepository.create({
        ...createQueueDto,
        queueNumber,
        queueDate: today,
        status: 'waiting',
      });

      return await this.queueRepository.save(queue);
    } catch (error) {
      throw new Error('Failed to create queue entry');
    }
  }

  async findAll(date?: string, status?: string): Promise<Queue[]> {
    try {
      const where: any = {};

      if (date) {
        where.queueDate = date;
      } else {
        where.queueDate = new Date().toISOString().split('T')[0];
      }

      if (status) {
        where.status = status;
      }

      return await this.queueRepository.find({
        where,
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      throw new Error('Failed to fetch queue entries');
    }
  }

  async findOne(id: number): Promise<Queue> {
    try {
      const queue = await this.queueRepository.findOne({ where: { id } });

      if (!queue) {
        throw new NotFoundException(`Queue entry with ID ${id} not found`);
      }

      return queue;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch queue entry');
    }
  }

  async update(id: number, updateQueueDto: UpdateQueueDto): Promise<Queue> {
    try {
      const queue = await this.findOne(id);
      Object.assign(queue, updateQueueDto);
      return await this.queueRepository.save(queue);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update queue entry');
    }
  }

  async updateStatus(id: number, status: string): Promise<Queue> {
    try {
      const queue = await this.findOne(id);
      queue.status = status;
      return await this.queueRepository.save(queue);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update queue status');
    }
  }

  async getStatistics(date?: string) {
    try {
      const queueDate = date || new Date().toISOString().split('T')[0];

      const [total, waiting, withDoctor, completed] = await Promise.all([
        this.queueRepository.count({ where: { queueDate } }),
        this.queueRepository.count({ where: { queueDate, status: 'waiting' } }),
        this.queueRepository.count({ where: { queueDate, status: 'with_doctor' } }),
        this.queueRepository.count({ where: { queueDate, status: 'completed' } }),
      ]);

      return {
        total,
        waiting,
        withDoctor,
        completed,
      };
    } catch (error) {
      throw new Error('Failed to fetch queue statistics');
    }
  }
}