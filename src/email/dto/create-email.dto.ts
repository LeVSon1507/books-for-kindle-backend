import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  to: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  cc?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  bcc?: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  html: string;
}
