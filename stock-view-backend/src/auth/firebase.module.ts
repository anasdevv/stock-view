import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  exports: [FirebaseService],
  providers: [FirebaseService, ConfigService],
})
export class FirebaseModule {}
