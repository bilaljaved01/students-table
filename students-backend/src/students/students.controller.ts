// ─────────────────────────────────────────────
//  students.controller.ts
//  defines the REST API routes — delegates all
//  actual work to StudentsService
//
//  Routes (all prefixed with /api from main.ts):
//    GET    /api/students          — list all (or search)
//    GET    /api/students/:id      — get one
//    POST   /api/students          — create
//    PATCH  /api/students/:id      — update
//    DELETE /api/students/:id      — delete
// ─────────────────────────────────────────────

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // GET /api/students
  // GET /api/students?search=priya  ← optional search param
  @Get()
  findAll(@Query('search') search?: string) {
    return this.studentsService.findAll(search);
  }

  // GET /api/students/42
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  // POST /api/students
  // body: { name, email, age }
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  // PATCH /api/students/42
  // body: { name?, email?, age? }  — all optional
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  // DELETE /api/students/42
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
