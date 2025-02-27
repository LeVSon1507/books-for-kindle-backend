import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenvConfig({ path: '.env' });

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectRepository(Email) private emailRepository: Repository<Email>,
  ) {}

  async onModuleInit() {
    const sendgridApiKey = String(process.env.SENDGRID_API_KEY);
    if (!sendgridApiKey) {
      throw new Error(
        'SENDGRID_API_KEY is not defined in environment variables',
      );
    }
    sgMail.setApiKey(sendgridApiKey);
    this.logger.log('SendGrid initialized successfully');
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
      const msg = {
        from: process.env.EMAIL_FROM ?? 'easykindle@easy-kindle.com',
        to: this.convertMail(email.to),
        cc: email.cc ? this.convertMail(email.cc) : undefined,
        bcc: email.bcc ? this.convertMail(email.bcc) : undefined,
        subject: email.subject,
        html: email.html,
      };

      const response = await sgMail.send(msg);

      if (
        response &&
        response[0] &&
        response[0].statusCode >= 200 &&
        response[0].statusCode < 300
      ) {
        email.sent = true;
        email.id = response[0].headers['x-message-id'];
        this.logger.log(
          `Email ${emailId} sent successfully with SendGrid ID: ${email.id}`,
        );
      } else {
        email.error = JSON.stringify(response);
        this.logger.error(`Failed to send email ${emailId}`, response);
      }

      return this.emailRepository.save(email);
    } catch (error) {
      email.error = JSON.stringify(error);
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
