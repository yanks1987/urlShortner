import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'your_db_user',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_DATABASE || 'your_db_name',
      autoLoadEntities: true,
      synchronize: true, // set to false in production!
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
