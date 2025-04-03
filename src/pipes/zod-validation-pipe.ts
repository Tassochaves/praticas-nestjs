
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema  } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
      
    } catch (error) {
        if(error instanceof ZodError){
            throw new BadRequestException({
                message: 'Validantion failed',
                statusCode: 400,
                errors: error.format(),
                
            })
        }
      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
