import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email')
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column({ nullable: true })
  cc: string;

  @Column({ nullable: true })
  bcc: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  html: string;

  @Column({ default: false })
  sent: boolean;

  @Column({ nullable: true })
  sendgridId: string;

  @Column({ nullable: true, type: 'json' })
  error: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
