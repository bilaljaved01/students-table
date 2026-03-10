// ─────────────────────────────────────────────
//  student.entity.ts
//  TypeORM entity — this becomes the "students"
//  table in PostgreSQL automatically
// ─────────────────────────────────────────────

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ type: 'int' })
  age: number;

  // nice to have — lets you sort by newest added
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
