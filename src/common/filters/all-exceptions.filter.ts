import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Logs client vs server errors and returns safe 500 bodies in production.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const isProd = process.env.NODE_ENV === 'production';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const msg =
        status >= 500
          ? { msg: 'server_http', path: req.url, method: req.method, status, payload }
          : { msg: 'client_http', path: req.url, method: req.method, status, payload };
      if (status >= 500) {
        this.logger.error(msg);
      } else {
        this.logger.warn(msg);
      }
      res.status(status).json(payload);
      return;
    }

    this.logger.error(
      {
        msg: 'unhandled',
        path: req.url,
        method: req.method,
        error: exception instanceof Error ? exception.message : String(exception),
      },
      exception instanceof Error ? exception.stack : undefined,
    );

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        isProd || !(exception instanceof Error)
          ? 'Internal server error'
          : exception.message,
    });
  }
}
