import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1745000000000 implements MigrationInterface {
  name = 'InitialSchema1745000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE borrowing_status_enum AS ENUM ('active', 'returned', 'overdue')`
    );
    await queryRunner.query(`
      CREATE TABLE books (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        author VARCHAR(300) NOT NULL,
        isbn VARCHAR(13) UNIQUE,
        description TEXT,
        publisher VARCHAR(100),
        "publishedYear" INTEGER,
        genre VARCHAR(100),
        "totalCopies" INTEGER NOT NULL DEFAULT 1,
        "availableCopies" INTEGER NOT NULL DEFAULT 1,
        "coverImageUrl" VARCHAR(500),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX IDX_books_title_author ON books (title, author)`);
    await queryRunner.query(`
      CREATE TABLE borrowings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        "userName" VARCHAR(300) NOT NULL,
        "bookId" UUID NOT NULL REFERENCES books(id),
        status borrowing_status_enum NOT NULL DEFAULT 'active',
        "borrowedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "dueDate" TIMESTAMP NOT NULL,
        "returnedAt" TIMESTAMP
      )
    `);
    await queryRunner.query(`CREATE INDEX IDX_borrowings_userId ON borrowings ("userId")`);
    await queryRunner.query(`CREATE INDEX IDX_borrowings_status ON borrowings (status)`);
    await queryRunner.query(`CREATE INDEX IDX_borrowings_dueDate ON borrowings ("dueDate")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE borrowings`);
    await queryRunner.query(`DROP INDEX IDX_books_title_author`);
    await queryRunner.query(`DROP TABLE books`);
    await queryRunner.query(`DROP TYPE borrowing_status_enum`);
  }
}
