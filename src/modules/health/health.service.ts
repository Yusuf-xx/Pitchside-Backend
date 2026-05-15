import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return { status: 'ok', service: 'pitchside-api', version: '1.0.0' };
  }
}
