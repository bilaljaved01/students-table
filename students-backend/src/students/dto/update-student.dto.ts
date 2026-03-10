// ─────────────────────────────────────────────
//  update-student.dto.ts
//  same shape as CreateStudentDto but every
//  field is optional — so PATCH can update
//  just name, just email, or all three
// ─────────────────────────────────────────────

import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

// PartialType makes all fields from CreateStudentDto optional
// while keeping all the same validators active
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
