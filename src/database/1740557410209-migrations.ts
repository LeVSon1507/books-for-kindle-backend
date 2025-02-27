import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBooksTable1740557410209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TYPE "book_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'DRAFT')
    `);

    await queryRunner.query(`
      CREATE TYPE "book_category_enum" AS ENUM('FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 'BUSINESS', 'SELF_HELP', 'BIOGRAPHY', 'HISTORY', 'OTHER')
    `);

    await queryRunner.query(`
      CREATE TABLE "book" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "description" varchar NOT NULL,
        "long_description" text,
        "price" bigint NOT NULL,
        "author" varchar(255) NOT NULL,
        "status" "book_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "category" "book_category_enum" NOT NULL DEFAULT 'OTHER',
        "publisher" varchar(255),
        "publication_date" date,
        "isbn" varchar(20),
        "page_count" int,
        "language" varchar(50) DEFAULT 'Vietnamese',
        "book_cover_image_url" varchar,
        "epub_url" varchar,
        "pdf_url" varchar,
        "sample_url" varchar,
        "is_featured" boolean DEFAULT false,
        "average_rating" decimal(3,2) DEFAULT 0,
        "rating_count" int DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "book"
    `);

    await queryRunner.query(`
      DROP TYPE "book_category_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "book_status_enum"
    `);
  }
}
