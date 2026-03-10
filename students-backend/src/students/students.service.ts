// ─────────────────────────────────────────────
//  students.service.ts
//  all the actual database work lives here —
//  the controller just calls these methods
// ─────────────────────────────────────────────

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) {}

  // GET all students — optionally filter by search query
  async findAll(search?: string): Promise<Student[]> {
    if (!search) {
      return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    // search across name, email, and age
    return this.repo
      .createQueryBuilder('student')
      .where('LOWER(student.name) LIKE :q', { q: `%${search.toLowerCase()}%` })
      .orWhere('LOWER(student.email) LIKE :q', { q: `%${search.toLowerCase()}%` })
      .orWhere('CAST(student.age AS TEXT) LIKE :q', { q: `%${search}%` })
      .orderBy('student.createdAt', 'DESC')
      .getMany();
  }

  // GET one student by ID
  async findOne(id: number): Promise<Student> {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return student;
  }

  // POST — create a new student
  async create(dto: CreateStudentDto): Promise<Student> {
    // check if email is already taken
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('A student with this email already exists');
    }

    const student = this.repo.create(dto);
    return this.repo.save(student);
  }

  // PATCH — update only the fields that were sent
  async update(id: number, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id); // throws 404 if not found

    // if email is being changed, make sure the new one isn't taken
    if (dto.email && dto.email !== student.email) {
      const existing = await this.repo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('A student with this email already exists');
      }
    }

    Object.assign(student, dto);
    return this.repo.save(student);
  }

  // DELETE — remove a student
  async remove(id: number): Promise<{ message: string }> {
    const student = await this.findOne(id); // throws 404 if not found
    await this.repo.remove(student);
    return { message: `${student.name} deleted successfully` };
  }
}
