import { FastifyReply } from 'fastify';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class AllHttpExceptionFilter implements ExceptionFilter {
  private debug: boolean;

  constructor() {
    this.debug = process.env.APP_DEBUG === 'true';
  }

  catch(exception: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse() as FastifyReply;
    if (exception['response']) {
      return res.code(exception['status']).send(exception['response']);
    }

    if (!this.debug) {
      const code = exception['status'] ?? 500;
      return res.code(code).send({
        statusCode: code,
        message:
          code < 500 ? exception.message : 'Error! Please try again later.',
      });
    }

    return res.code(500).send({
      statusCode: 500,
      error: exception.name + ': ' + exception.message,
      message: exception.stack,
    });
  }
}
