import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { configureApp } from '../src/bootstrap/configure-app';
import { HealthModule } from '../src/modules/health/health.module';

/**
 * Smoke test without a database — exercises global middleware, prefix, and health route.
 * Full-stack e2e against AppModule belongs behind a real DATABASE_URL (e.g. staging).
 */
describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('GET /api/v1/health', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toEqual('ok');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
