import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';

class AttendanceEntryDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsBoolean()
  attended!: boolean;
}

export class MarkAttendanceDto {
  @ApiProperty({ type: [AttendanceEntryDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendanceEntryDto)
  entries!: AttendanceEntryDto[];
}
