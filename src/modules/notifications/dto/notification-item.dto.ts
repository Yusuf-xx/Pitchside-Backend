import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'Machine category for clients (e.g. GENERIC, BOOKING, GAME)' })
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  read!: boolean;

  @ApiPropertyOptional({ description: 'ISO time when marked read' })
  readAt?: string;

  @ApiPropertyOptional({
    description: 'In-app path for navigation, e.g. /games/cuid (optional)',
  })
  actionPath?: string;
}
