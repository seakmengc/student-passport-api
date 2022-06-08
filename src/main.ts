import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationError } from 'class-validator';
import { TransformFilterQueryStringPipe } from 'src/pipes/transform-filter-query-string-pipe.pipe';
import { TransformInputPipe } from 'src/pipes/transform-input-pipe.pipe';
import { AllHttpExceptionFilter } from 'src/filters/all-http-exception.filter';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import * as mongoSanitize from 'express-mongo-sanitize';

function setError(
  error: ValidationError,
  formatErrors: Record<string, unknown>,
  prefix = '',
) {
  if (error.children.length === 0) {
    formatErrors[prefix + error.property] = Object.values(
      error.constraints,
    ).map((each) => 'This' + each.replace(error.property, ''));

    return;
  }

  for (const child of error.children) {
    setError(child, formatErrors, error.property + '.');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  mongoose.set('debug', (process.env.NODE_ENV ?? 'local') === 'local');

  app.enableCors({
    maxAge: 86400,
  });
  app.use(mongoSanitize());
  // app.use(helmet());
  // app.use(cookieParser());

  app.useGlobalPipes(new TransformFilterQueryStringPipe());
  app.useGlobalPipes(new TransformInputPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formatErrors = {};
        for (const error of errors) {
          setError(error, formatErrors);
        }

        return {
          response: {
            errors: formatErrors,
            message: 'The given data was invalid.',
            statusCode: 400,
          },
          status: 400,
        };
      },
    }),
  );

  app.useGlobalFilters(new AllHttpExceptionFilter());

  // app.use((req, res, next) => {
  //   Logger.debug({ url: req.url, rid: req.headers.rid, body: req.body });
  //   next();
  // });

  // const config = new DocumentBuilder()
  //   .setTitle('API')
  //   .setDescription('This is where all related service docs resided.')
  //   .addServer('http://localhost:8000', 'Local')
  //   .setVersion('0.1')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);

  // SwaggerModule.setup('/api-docs', app, document);

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
