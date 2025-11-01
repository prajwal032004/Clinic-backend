import { QueueService } from './queue.service';
import { CreateQueueDto, UpdateQueueDto } from './dto/queue.dto';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    create(createQueueDto: CreateQueueDto): Promise<import("./entities/queue.entity").Queue>;
    findAll(date?: string, status?: string): Promise<import("./entities/queue.entity").Queue[]>;
    getStatistics(date?: string): Promise<{
        total: number;
        waiting: number;
        withDoctor: number;
        completed: number;
    }>;
    findOne(id: string): Promise<import("./entities/queue.entity").Queue>;
    update(id: string, updateQueueDto: UpdateQueueDto): Promise<import("./entities/queue.entity").Queue>;
    updateStatus(id: string, status: string): Promise<import("./entities/queue.entity").Queue>;
}
