import { ApiProperty } from '@nestjs/swagger';
import { DefaultWithSoftDelete } from 'src/common/entities/default-with-soft-delete.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends DefaultWithSoftDelete {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;
}
