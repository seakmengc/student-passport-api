import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { TelescopeService } from '../telescope.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly telescopeService: TelescopeService) {}

  use(req: any, res: Response, next: () => void) {
    const start = new Date();
    const startCpu = process.cpuUsage();

    this.hookOnRes(req, res, (resBody) => {
      this.telescopeService.create({
        userId: req.payload?.sub,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: Date.now() - start.getTime(),
        ip: req.ip,
        cpu: process.cpuUsage(startCpu)['user'] / 1000,
        memory:
          Math.round((process.memoryUsage()['heapTotal'] / 1024 / 1024) * 100) /
          100,
        headers: JSON.stringify(req.headers),
        body: JSON.stringify(req.body),
        response: resBody,
        time: start,
      });
    });

    next();
  }

  private hookOnRes(req, res, callback) {
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    res.write = (chunk, ...args) => {
      chunks.push(chunk);
      return oldWrite.apply(res, [chunk, ...args]);
    };

    res.end = (chunk, ...args) => {
      if (chunk) {
        chunks.push(chunk);
      }

      if (
        res.get('content-type')?.startsWith('application/json') &&
        chunks.length < 1_000_000 //1MB
      ) {
        const body = Buffer.concat(chunks).toString('utf8');

        callback(body);
      }

      return oldEnd.apply(res, [chunk, ...args]);
    };
  }
}
