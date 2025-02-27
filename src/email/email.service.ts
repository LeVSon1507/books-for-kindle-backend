import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { Resend } from 'resend';

dotenvConfig({ path: '.env' });

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(
    @InjectRepository(Email) private emailRepository: Repository<Email>,
  ) {
    const resendApiKey = String(process.env.RESEND_API_KEY);
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    this.resend = new Resend(resendApiKey);
  }

  async createEmail(createEmailDto: CreateEmailDto) {
    const email = this.emailRepository.create({
      ...createEmailDto,
      sent: false,
    });
    return this.emailRepository.save(email);
  }

  private convertMail = (email: string) =>
    email.split(',').map((e) => e.trim());

  async sendEmail(emailId: string): Promise<Email> {
    const email = await this.emailRepository.findOne({
      where: { id: emailId },
    });

    if (!email) {
      throw new NotFoundException(`Email with ${emailId} not found`);
    }

    if (email.sent) {
      this.logger.log(`Email ${emailId} already sent`);
      return email;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM ?? 'easy-kindle@gmail.com',
        to: this.convertMail(email.to),
        cc: email.cc ? this.convertMail(email.cc) : undefined,
        bcc: email.bcc ? this.convertMail(email.bcc) : undefined,
        subject: email.subject,
        html: email.html,
      });

      const { id } = data || {};

      if (error) {
        email.error = error;
        this.logger.error(`Failed to send email ${emailId}`, error);
      } else {
        email.sent = true;
        email.resendId = id as string;
        this.logger.log(
          `Email ${emailId} sent successfully with Resend ID: ${id}`,
        );
      }

      return this.emailRepository.save(email);
    } catch (error) {
      email.error = error;
      this.logger.error(`Exception when sending email ${emailId}`, error);
      return this.emailRepository.save(email);
    }
  }

  async createAndSendEmail(emailData: CreateEmailDto): Promise<Email> {
    const email = await this.createEmail(emailData);
    return this.sendEmail(email.id);
  }

  async getEmailById(id: string): Promise<Email | null> {
    const result = this.emailRepository.findOne({ where: { id } });
    return result;
  }

  async getEmailsByStatus(sent: boolean): Promise<Email[]> {
    return this.emailRepository.find({ where: { sent } });
  }

  async retryFailedEmails(): Promise<Email[]> {
    const failedEmails = await this.getEmailsByStatus(false);
    const results = [] as Email[];

    for (const email of failedEmails) {
      const result = await this.sendEmail(email.id);
      results.push(result);
    }

    return results;
  }
}
