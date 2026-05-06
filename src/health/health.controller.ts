import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { buildResponse } from '../common/dto/api-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Verificar estado de la API',
    description: 'Retorna el estado actual del servicio.',
  })
  @ApiOkResponse({
    description: 'API funcionando correctamente.',
  })
  getHealth() {
    return buildResponse('Holiday API Colombia funcionando correctamente.', {
      status: 'ok',
      service: 'holiday-api-colombia',
      timestamp: new Date().toISOString(),
    });
  }
}
