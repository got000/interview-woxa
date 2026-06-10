import { Module } from '@nestjs/common';
import { CryptorService } from './cryptor.service';

@Module({
  providers: [CryptorService]
})
export class CryptorModule {}
