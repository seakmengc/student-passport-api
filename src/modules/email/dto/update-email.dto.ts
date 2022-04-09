import { CreateEmailDto } from './create-email.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateEmailDto extends PartialType(CreateEmailDto) {}
