import { Repository } from 'typeorm';
import { Queue } from './entities/queue.entity';
import { CreateQueueDto, UpdateQueueDto } from './dto/queue.dto';
export declare class QueueService {
    private queueRepository;
    constructor(queueRepository: Repository<Queue>);
    private generateQueueNumber;
    create(createQueueDto: CreateQueueDto): Promise<Queue>;
    findAll(date?: string, status?: string): Promise<Queue[]>;
    findOne(id: number): Promise<Queue>;
    update(id: number, updateQueueDto: UpdateQueueDto): Promise<Queue>;
    updateStatus(id: number, status: string): Promise<Queue>;
    getStatistics(date?: string): Promise<{
        total: number;
        waiting: number;
        withDoctor: number;
        completed: number;
    }>;
}
