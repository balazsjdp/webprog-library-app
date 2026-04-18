import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Book } from './Book';

export enum BorrowingStatus {
  ACTIVE = 'active',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Entity('borrowings')
@Index(['userId'])
@Index(['status'])
@Index(['dueDate'])
export class Borrowing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({ length: 300 })
  userName!: string;

  @Column('uuid')
  bookId!: string;

  @ManyToOne(() => Book, (b: Book) => b.borrowings, { eager: false })
  @JoinColumn({ name: 'bookId' })
  book!: Book;

  @Column({ type: 'enum', enum: BorrowingStatus, default: BorrowingStatus.ACTIVE })
  status!: BorrowingStatus;

  @CreateDateColumn()
  borrowedAt!: Date;

  @Column({ type: 'timestamp' })
  dueDate!: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt!: Date | null;
}
