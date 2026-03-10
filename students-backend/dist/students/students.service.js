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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("./student.entity");
let StudentsService = class StudentsService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(search) {
        if (!search) {
            return this.repo.find({ order: { createdAt: 'DESC' } });
        }
        return this.repo
            .createQueryBuilder('student')
            .where('LOWER(student.name) LIKE :q', { q: `%${search.toLowerCase()}%` })
            .orWhere('LOWER(student.email) LIKE :q', { q: `%${search.toLowerCase()}%` })
            .orWhere('CAST(student.age AS TEXT) LIKE :q', { q: `%${search}%` })
            .orderBy('student.createdAt', 'DESC')
            .getMany();
    }
    async findOne(id) {
        const student = await this.repo.findOne({ where: { id } });
        if (!student) {
            throw new common_1.NotFoundException(`Student with id ${id} not found`);
        }
        return student;
    }
    async create(dto) {
        const existing = await this.repo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('A student with this email already exists');
        }
        const student = this.repo.create(dto);
        return this.repo.save(student);
    }
    async update(id, dto) {
        const student = await this.findOne(id);
        if (dto.email && dto.email !== student.email) {
            const existing = await this.repo.findOne({ where: { email: dto.email } });
            if (existing) {
                throw new common_1.ConflictException('A student with this email already exists');
            }
        }
        Object.assign(student, dto);
        return this.repo.save(student);
    }
    async remove(id) {
        const student = await this.findOne(id);
        await this.repo.remove(student);
        return { message: `${student.name} deleted successfully` };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map