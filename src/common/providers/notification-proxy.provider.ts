import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

export class NotificationProxy {
  static providerName = 'NOTI';

  static register() {
    return {
      provide: NotificationProxy.providerName,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RMQ_NOTI_URL')],
            queue: configService.get('RMQ_NOTI_QUEUE'),
            prefetchCount: 1,
            noAck: false,
          },
        } as RmqOptions;

        return ClientProxyFactory.create(config);
      },
    };
  }
}
