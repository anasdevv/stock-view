import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class GetIndexDataDto {
  @IsOptional()
  @IsDateString()
  @Transform(
    ({ value }) => {
      console.log('value ', value);
      if (!value) {
        return new Date().toISOString().split('T')[0];
      }
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
      }
      return parsedDate.toISOString().split('T')[0];
    },
    { toClassOnly: true },
  )
  date?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || 'minute')
  timespan?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || '1')
  multiplier?: string;
}
