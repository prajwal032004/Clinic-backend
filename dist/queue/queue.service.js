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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const queue_entity_1 = require("./entities/queue.entity");
let QueueService = class QueueService {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }
    generateQueueNumber(count) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const number = String(count + 1).padStart(3, '0');
        return `Q${dateStr}-${number}`;
    }
    async create(createQueueDto) {
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
        }
        catch (error) {
            throw new Error('Failed to create queue entry');
        }
    }
    async findAll(date, status) {
        try {
            const where = {};
            if (date) {
                where.queueDate = date;
            }
            else {
                where.queueDate = new Date().toISOString().split('T')[0];
            }
            if (status) {
                where.status = status;
            }
            return await this.queueRepository.find({
                where,
                order: { createdAt: 'ASC' },
            });
        }
        catch (error) {
            throw new Error('Failed to fetch queue entries');
        }
    }
    async findOne(id) {
        try {
            const queue = await this.queueRepository.findOne({ where: { id } });
            if (!queue) {
                throw new common_1.NotFoundException(`Queue entry with ID ${id} not found`);
            }
            return queue;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to fetch queue entry');
        }
    }
    async update(id, updateQueueDto) {
        try {
            const queue = await this.findOne(id);
            Object.assign(queue, updateQueueDto);
            return await this.queueRepository.save(queue);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to update queue entry');
        }
    }
    async updateStatus(id, status) {
        try {
            const queue = await this.findOne(id);
            queue.status = status;
            return await this.queueRepository.save(queue);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error('Failed to update queue status');
        }
    }
    async getStatistics(date) {
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
        }
        catch (error) {
            throw new Error('Failed to fetch queue statistics');
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(queue_entity_1.Queue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QueueService);
//# sourceMappingURL=queue.service.js.map