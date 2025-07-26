import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(protected prismaService: PrismaService) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: userData,
    });

    return user;
  }
}
