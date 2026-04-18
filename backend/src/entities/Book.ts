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

  @Column({ length: 500 })
  title!: string;

  @Column({ length: 300 })
  author!: string;

  @Column({ length: 13, unique: true, nullable: true })
  isbn!: string | null;

  @Column('text', { nullable: true })
  description!: string | null;

  @Column({ length: 100, nullable: true })
  publisher!: string | null;

  @Column({ nullable: true })
  publishedYear!: number | null;

  @Column({ length: 100, nullable: true })
  genre!: string | null;

  @Column({ default: 1 })
  totalCopies!: number;

  @Column({ default: 1 })
  availableCopies!: number;

  @Column({ length: 500, nullable: true })
  coverImageUrl!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Borrowing, (b: Borrowing) => b.book)
  borrowings!: Borrowing[];
}
