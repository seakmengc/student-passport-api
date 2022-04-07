// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidationArguments,
// } from 'class-validator';
// import { FindOneOptions, Repository } from 'typeorm';

// export function IsUnique<T>(
//   entityFn: () => Repository<T>,
//   property?: string,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: unknown, propertyName: string) {
//     if (!property) {
//       property = propertyName;
//     }

//     registerDecorator({
//       name: 'IsUnique',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [property, entityFn],
//       options: validationOptions,
//       async: true,
//       validator: {
//         validate: async (value: any, _: ValidationArguments) => {
//           const finder: FindOneOptions = {
//             select: ['id'],
//             where: {},
//           };

//           finder['where'][property] = value;

//           const record = await entityFn().findOne(finder);

//           return record ? false : true;
//         },
//         defaultMessage: (_?: ValidationArguments): string => {
//           return property + ' is already exists.';
//         },
//       },
//     });
//   };
// }
