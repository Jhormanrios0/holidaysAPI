import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    example: true,
    description: 'Indica si la petición fue exitosa.',
  })
  success: boolean;

  @ApiProperty({
    example: 'Operación realizada correctamente.',
    description: 'Mensaje descriptivo de la respuesta.',
  })
  message: string;

  @ApiProperty({
    description: 'Información retornada por el endpoint.',
  })
  data: T;
}

export function buildResponse<T>(message: string, data: T): ApiResponseDto<T> {
  return {
    success: true,
    message,
    data,
  };
}
