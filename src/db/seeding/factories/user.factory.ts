import { Role, User, UserSchema } from 'src/modules/user/entities/user.entity';
import { faker as Faker } from '@faker-js/faker';
import mongoose from 'mongoose';

export class UserFactory {
  private UserModel: mongoose.Model<mongoose.Document<User>>;

  constructor(private faker: typeof Faker) {
    this.UserModel = mongoose.model(User.name, UserSchema);
  }

  clear() {
    return this.UserModel.deleteMany({});
  }

  factory() {
    const user = new User();

    user.firstName = this.faker.name.firstName();
    user.lastName = this.faker.name.lastName();
    user.email = this.faker.internet.exampleEmail();
    // user.recoveryEmail = this.faker.internet.exampleEmail();
    user.password = 'password';

    user.role = Role.STUDENT;

    return user;
  }

  create(replaced: Partial<User> = {}) {
    return this.UserModel.create(Object.assign(this.factory(), replaced));
  }

  createMany(count: number, replaced: Partial<User> = {}) {
    const models = [];
    for (let index = 0; index < count; index++) {
      models.push(Object.assign(this.factory(), replaced));
    }

    return this.UserModel.create(models);
  }
}
