import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class ThrottleGuard implements CanActivate {
  private rateLimitMap = new Map<string, RateLimitEntry>();
  
  // Different limits for different endpoints
  private readonly limits = {
    '/auth/login': { limit: 5, windowMs: 300000 }, // 5 attempts per 5 minutes
    '/auth/register': { limit: 3, windowMs: 600000 }, // 3 attempts per 10 minutes
    '/urls': { limit: 10, windowMs: 60000 }, // 10 URLs per minute
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.getKey(request);
    const path = request.path;
    
    // Get limit configuration for this path
    const config = this.limits[path] || { limit: 10, windowMs: 60000 };
    
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }
    
    if (entry.count >= config.limit) {
      const remainingTime = Math.ceil((entry.resetTime - now) / 1000);
      throw new HttpException(
        `Too many requests. Please try again in ${remainingTime} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    
    entry.count++;
    return true;
  }

  private getKey(request: Request): string {
    // Get real IP address (handles proxy headers)
    const ip = this.getClientIp(request);
    const path = request.path;
    return `${ip}:${path}`;
  }

  private getClientIp(request: Request): string {
    // Check for forwarded headers (common with proxies)
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    }
    
    // Check for real IP header
    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }
    
    // Fallback to connection remote address
    return request.ip || request.connection.remoteAddress || 'unknown';
  }
} 