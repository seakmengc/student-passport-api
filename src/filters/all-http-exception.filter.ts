import { Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import mongoose from 'mongoose';

@Catch()
export class AllHttpExceptionFilter implements ExceptionFilter {
  private debug: boolean;

  constructor() {
    this.debug = process.env.APP_DEBUG === 'true';
  }

  catch(exception: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse() as Response;
    if (exception['response']) {
      return res.status(exception['status']).send(exception['response']);
    }

    if (exception instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Document not found!',
      });
    }

    if (!this.debug) {
      const code = exception['status'] ?? 500;
      return res.status(code).send({
        statusCode: code,
        message:
          code < 500 ? exception.message : 'Error! Please try again later.',
      });
    }

    return res.status(500).send({
      statusCode: 500,
      error: exception.name + ': ' + exception.message,
      message: exception.stack,
    });
  }
}
