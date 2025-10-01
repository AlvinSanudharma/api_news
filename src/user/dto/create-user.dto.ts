import z, { ZodObject } from 'zod';

const CreateUserSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(1, {
      message: 'Username is required',
    }),
  email: z
    .string({
      message: 'Email must be a string',
    })
    .email({
      message: 'Email must be a valid email address',
    }),
  name: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(1, {
      message: 'Username is required',
    }),
  avatar: z.string().nullable().optional(),
});

export class CreateUserDto {
  static schema: ZodObject<typeof CreateUserSchema.shape> = CreateUserSchema;

  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly name: string,
    public avatar?: string,
  ) {}
}
