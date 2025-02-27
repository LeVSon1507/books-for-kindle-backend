import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export enum BookCategory {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCIENCE = 'SCIENCE',
  TECHNOLOGY = 'TECHNOLOGY',
  BUSINESS = 'BUSINESS',
  SELF_HELP = 'SELF_HELP',
  BIOGRAPHY = 'BIOGRAPHY',
  HISTORY = 'HISTORY',
  OTHER = 'OTHER',
}

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'text', name: 'long_description', nullable: true })
  longDescription?: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.ACTIVE })
  status: BookStatus;

  @Column({ type: 'enum', enum: BookCategory, default: BookCategory.OTHER })
  category: BookCategory;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher?: string;

  @Column({ name: 'publication_date', type: 'date', nullable: true })
  publicationDate?: Date;

  @Column({ name: 'isbn', type: 'varchar', length: 20, nullable: true })
  isbn?: string;

  @Column({
    name: 'language',
    type: 'varchar',
    length: 50,
    default: 'Vietnamese',
  })
  language: string;

  @Column({ name: 'book_cover_image_url', type: 'varchar', nullable: true })
  bookCoverImageUrl?: string;

  @Column({ name: 'epub_url', type: 'varchar', nullable: true })
  epubUrl?: string;

  @Column({ name: 'pdf_url', type: 'varchar', nullable: true })
  pdfUrl?: string;

  @Column({ name: 'sample_url', type: 'varchar', nullable: true })
  sampleUrl?: string;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  averageRating: number;

  @Column({ name: 'rating_count', type: 'int', default: 0 })
  ratingCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
