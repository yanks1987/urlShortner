import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../user/user.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async createUrl(originalUrl: string, slug: string, user?: User) {
    // Check if slug already exists
    const existingUrl = await this.urlRepository.findOne({ where: { slug } });
    if (existingUrl) {
      throw new ConflictException('Slug already exists. Please choose a different one.');
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      throw new BadRequestException('Invalid URL format');
    }

    // Create and save the URL
    const url = this.urlRepository.create({ 
      originalUrl, 
      slug, 
      user,
      visitCount: 0 
    });
    
    const savedUrl = await this.urlRepository.save(url);
    
    // Return with short URL
    return {
      ...savedUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${slug}`
    };
  }

  async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.urlRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  async incrementVisitCount(slug: string) {
    const url = await this.urlRepository.findOne({ where: { slug } });
    if (url) {
      url.visitCount += 1;
      await this.urlRepository.save(url);
    }
  }

  async findAllForUser(user: User) {
    const urls = await this.urlRepository.find({ where: { user } });
    return urls.map(url => ({
      ...url,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:4000'}/urls/${url.slug}`
    }));
  }

  async findBySlug(slug: string) {
    const url = await this.urlRepository.findOne({ where: { slug } });
    if (!url) throw new NotFoundException('URL not found');
    return url;
  }

  async updateUrl(slug: string, originalUrl: string, user: User) {
    const url = await this.urlRepository.findOne({ 
      where: { slug },
      relations: ['user']
    });
    
    if (!url) throw new NotFoundException('URL not found');
    if (url.user?.id !== user.id) throw new NotFoundException('Not authorized to update this URL');
    
    url.originalUrl = originalUrl;
    const savedUrl = await this.urlRepository.save(url);
    
    return {
      ...savedUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:4000'}/urls/${savedUrl.slug}`
    };
  }

  async deleteUrl(slug: string, user: User) {
    const url = await this.urlRepository.findOne({ 
      where: { slug },
      relations: ['user']
    });
    
    if (!url) throw new NotFoundException('URL not found');
    if (url.user?.id !== user.id) throw new NotFoundException('Not authorized to delete this URL');
    
    await this.urlRepository.remove(url);
    return { message: 'URL deleted successfully' };
  }
}
