import { Module } from '@nestjs/common';
import { DiasHabilesController } from './dias-habiles.controller';
import { FestivosController } from './festivos.controller';
import { HolidaysService } from './holidays.service';

@Module({
  controllers: [FestivosController, DiasHabilesController],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
