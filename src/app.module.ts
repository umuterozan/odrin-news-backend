import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { AdsModule } from './ads/ads.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, SessionEntity, CategoryEntity, PostEntity, CommentEntity, AdEntity } from './typeorm/entities';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [PostsModule, CategoriesModule, AdsModule, AuthModule, CommentsModule, UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'odrin_news',
      entities: [UserEntity, SessionEntity, CategoryEntity, PostEntity, CommentEntity, AdEntity],
      synchronize: true,
    }),
    SessionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
