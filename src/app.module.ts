import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true ,envFilePath : '.env'}),

    MongooseModule.forRoot(process.env.DB_URI || 'mongodb://localhost:27017/userPost'),AuthModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
