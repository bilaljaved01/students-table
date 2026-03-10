import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private readonly repo;
    constructor(repo: Repository<Student>);
    findAll(search?: string): Promise<Student[]>;
    findOne(id: number): Promise<Student>;
    create(dto: CreateStudentDto): Promise<Student>;
    update(id: number, dto: UpdateStudentDto): Promise<Student>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
