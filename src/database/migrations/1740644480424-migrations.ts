import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1740644480424 implements MigrationInterface {
  name = 'Create Books Table And Email 1740557410209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."book_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'DRAFT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."book_category_enum" AS ENUM('FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 'BUSINESS', 'SELF_HELP', 'BIOGRAPHY', 'HISTORY', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" character varying NOT NULL, "long_description" text, "price" numeric NOT NULL, "author" character varying(255) NOT NULL, "status" "public"."book_status_enum" NOT NULL DEFAULT 'ACTIVE', "category" "public"."book_category_enum" NOT NULL DEFAULT 'OTHER', "publisher" character varying(255), "publication_date" date, "isbn" character varying(20), "language" character varying(50) NOT NULL DEFAULT 'Vietnamese', "book_cover_image_url" character varying, "epub_url" character varying, "pdf_url" character varying, "sample_url" character varying, "is_featured" boolean NOT NULL DEFAULT false, "average_rating" numeric(5,2) NOT NULL DEFAULT '0', "rating_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "to" character varying NOT NULL, "cc" character varying, "bcc" character varying, "subject" character varying NOT NULL, "html" text NOT NULL, "sent" boolean NOT NULL DEFAULT false, "sendgridId" character varying,"templateEmailId" character varying, "error" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "email"`);
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TYPE "public"."book_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."book_status_enum"`);
  }
}
