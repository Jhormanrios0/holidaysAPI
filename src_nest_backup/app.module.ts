import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { HolidaysModule } from './holidays/holidays.module';

@Module({
  imports: [HolidaysModule, HealthModule],
})
export class AppModule {}
