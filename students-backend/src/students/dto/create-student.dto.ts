// ─────────────────────────────────────────────
//  create-student.dto.ts
//  defines + validates what the body of a
//  POST /api/students request must look like
// ─────────────────────────────────────────────

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: "Name can't be empty" })
  @MaxLength(100)
  name: string;

  @IsEmail({}, { message: 'Enter a valid email address' })
  @MaxLength(150)
  email: string;

  @IsInt()
  @Min(5,  { message: 'Age must be at least 5' })
  @Max(100, { message: 'Age must be at most 100' })
  age: number;
}
