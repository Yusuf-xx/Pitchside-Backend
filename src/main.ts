import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configureApp } from './bootstrap/configure-app';
import { AppModule } from './app.module';

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function swaggerEnabled(): boolean {
  const raw = process.env.ENABLE_SWAGGER?.trim().toLowerCase();
  if (raw === 'true' || raw === '1' || raw === 'yes') {
    return true;
  }
  if (raw === 'false' || raw === '0' || raw === 'no') {
    return false;
  }
  return process.env.NODE_ENV !== 'production';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  if (swaggerEnabled()) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PITCHSIDE API')
      .setDescription(
        'Mobile-first identity, games, turf booking, and tournaments. Game modes: Football, Futsal, Cricket.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
        'access-token',
      )
      .addTag('Health', 'Service health')
      .addTag('Auth', 'Authentication')
      .addTag('Users', 'Profiles and preferences')
      .addTag('Onboarding', 'Profile setup steps')
      .addTag('Player Cards', 'OVR, stats, badges')
      .addTag('Games', 'Find, join, create games')
      .addTag('Home', 'Home dashboard — feed, games, tournaments')
      .addTag('Turfs', 'Partner turf discovery')
      .addTag('Bookings', 'Turf booking and split pay')
      .addTag('Tournaments', 'Tournaments and leaderboards')
      .addTag('Teams', 'Squads and rosters')
      .addTag('Training', 'Check-ins and streaks')
      .addTag('Game Records', 'Post-match stats and ratings')
      .addTag('Leaderboards', 'City and national rankings')
      .addTag('Notifications', 'In-app notifications')
      .addTag('Admin', 'Ops — feed and CRM (protected)')
      .addTag('Partners', 'Turf owner interest')
      .addTag('Waitlist', 'Scout mode early access')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: false,
      jsonDocumentUrl: '/docs-json',
    });
  }

  const port = Number.parseInt(requiredEnv('PORT'), 10);
  if (!Number.isFinite(port) || port < 1) {
    throw new Error('PORT must be a positive integer');
  }
  await app.listen(port);
}
bootstrap();
