import { Module } from '@nestjs/common';
import { TelescopeService } from './telescope.service';
import { TelescopeController } from './telescope.controller';
import { Telescope, TelescopeSchema } from './entities/telescope.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Telescope.name, schema: TelescopeSchema },
    ]),
  ],
  controllers: [TelescopeController],
  providers: [TelescopeService],
  exports: [TelescopeService],
})
export class TelescopeModule {}
