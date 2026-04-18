import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany, Index,
} from 'typeorm';
import { Borrowing } from './Borrowing';

@Entity('books')
@Index(['title', 'author'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'varchar', length: 300 })
  author!: string;

  @Column({ type: 'varchar', length: 13, unique: true, nullable: true })
  isbn!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  publisher!: string | null;

  @Column({ type: 'int', nullable: true })
  publishedYear!: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genre!: string | null;

  @Column({ type: 'int', default: 1 })
  totalCopies!: number;

  @Column({ type: 'int', default: 1 })
  availableCopies!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Borrowing, (b: Borrowing) => b.book)
  borrowings!: Borrowing[];
}
