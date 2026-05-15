import type { Prisma } from '@prisma/client';
export declare function canonicalizeCityName(raw: string): string;
export declare function prismaCityEqualsInsensitive(city: string): Prisma.StringFilter;
