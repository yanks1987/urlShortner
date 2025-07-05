import { Controller, Post, Body, Get, Param, Req, UseGuards, Res, Patch, Delete, ValidationPipe, BadRequestException, ConflictException } from '@nestjs/common';
import { UrlService } from './url.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { User } from '../user/user.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { ThrottleGuard } from '../common/guards/throttle.guard';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(AuthGuard('jwt'), ThrottleGuard)
  @Post()
  async createUrl(@Body(ValidationPipe) createUrlDto: CreateUrlDto, @Req() req: Request) {
    const user = req.user as User;
    
    // Use custom slug if provided, otherwise generate random one
    let slug = createUrlDto.slug;
    if (!slug) {
      slug = randomBytes(4).toString('hex');
    }
    
    try {
      return await this.urlService.createUrl(createUrlDto.originalUrl, slug, user);
    } catch (error) {
      if (error instanceof ConflictException && createUrlDto.slug) {
        // If custom slug conflicts, generate a unique one
        const uniqueSlug = await this.urlService.generateUniqueSlug(createUrlDto.slug);
        return await this.urlService.createUrl(createUrlDto.originalUrl, uniqueSlug, user);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserUrls(@Req() req: Request) {
    // @ts-ignore
    const user = req.user as User;
    return this.urlService.findAllForUser(user);
  }

  @Get('/:slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const url = await this.urlService.findBySlug(slug);
    
    // Track the visit
    await this.urlService.incrementVisitCount(slug);
    
    // Perform actual redirect
    return res.redirect(url.originalUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:slug')
  async updateUrl(
    @Param('slug') slug: string,
    @Body('originalUrl') originalUrl: string,
    @Req() req: Request
  ) {
    const user = req.user as User;
    return this.urlService.updateUrl(slug, originalUrl, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:slug')
  async deleteUrl(@Param('slug') slug: string, @Req() req: Request) {
    const user = req.user as User;
    return this.urlService.deleteUrl(slug, user);
  }
}
