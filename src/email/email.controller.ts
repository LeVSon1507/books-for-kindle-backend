import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendEmail(
    @Body()
    emailData: CreateEmailDto,
  ) {
    try {
      return await this.emailService.createAndSendEmail(emailData);
    } catch (error) {
      throw new HttpException(
        `Failed to send email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getEmail(@Param('id') id: string) {
    const email = await this.emailService.getEmailById(id);
    if (!email) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }
    return email;
  }

  @Post('retry/:id')
  async retryEmail(@Param('id') id: string) {
    try {
      return await this.emailService.sendEmail(id);
    } catch (error) {
      throw new HttpException(
        `Failed to retry email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('retry-all-failed')
  async retryAllFailedEmails() {
    try {
      return await this.emailService.retryFailedEmails();
    } catch (error) {
      throw new HttpException(
        `Failed to retry failed emails: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
