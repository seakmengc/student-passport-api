import { SetMetadata } from '@nestjs/common';

/**
 * Check any role
 */
export const HasAnyRole = (...args: string[]) => SetMetadata('role', args);
