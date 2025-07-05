import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Use environment variables for DB config, with sensible defaults
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'urluser',
      password: process.env.DB_PASSWORD || 'urlpassword',
      database: process.env.DB_DATABASE || 'urlshortener',
      autoLoadEntities: true,
      synchronize: true, // set to false in production!
    }),
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
