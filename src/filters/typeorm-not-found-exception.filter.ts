import { FastifyReply } from 'fastify';
import { EntityNotFoundError } from 'typeorm';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(EntityNotFoundError)
export class TypeormNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = 404;

    response.status(statusCode).send({
      statusCode: statusCode,
      message: exception.message,
    });
  }
}
