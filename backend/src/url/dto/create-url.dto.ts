import { IsUrl, IsOptional, IsString, Length } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'Please provide a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @Length(3, 20, { message: 'Slug must be between 3 and 20 characters' })
  slug?: string;
} 