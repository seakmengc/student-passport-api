import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCookie from 'fastify-cookie';
import { AppModule } from './app.module';
import { ValidationError } from 'class-validator';
import { TransformFilterQueryStringPipe } from 'src/pipes/transform-filter-query-string-pipe.pipe';
import { TransformInputPipe } from 'src/pipes/transform-input-pipe.pipe';
import { AllHttpExceptionFilter } from 'src/filters/all-http-exception.filter';
import { TypeormNotFoundExceptionFilter } from 'src/filters/typeorm-not-found-exception.filter';

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
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({}),
  );

  app.register(fastifyCookie, {
    secret: process.env.APP_SECRET, // for cookies signature
  });

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
  app.useGlobalFilters(new TypeormNotFoundExceptionFilter());

  // app.use((req, res, next) => {
  //   Logger.debug({ url: req.url, rid: req.headers.rid, body: req.body });
  //   next();
  // });

  // const config = new DocumentBuilder()
  //   .setTitle('API')
  //   .setDescription('This is where all related service docs resided.')
  //   .addServer('http://localhost:3000', 'Local')
  //   .setVersion('0.1')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);

  // SwaggerModule.setup('/api-docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
