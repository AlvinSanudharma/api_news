import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/user/avatar',
        filename: (req, file, callback) => {
          const fileExt = extname(file.originalname);

          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `avatar-${uniqueSuffix}${fileExt}`;

          callback(null, filename);
        },
      }),
    }),
  )
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: CreateUserDto,
  ): Promise<User> {
    if (file) {
      userData.avatar = file.filename;
    }

    const user = await this.userService.createUser(userData);

    return user;
  }

  @Get()
  async getAllUsers(@Req() req: Request): Promise<User[]> {
    const users = await this.userService.getAllUsers();

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return users.map((user) => ({
      ...user,
      avatar: user.avatar
        ? `${baseUrl}/uploads/user/avatar/${user.avatar}`
        : null,
    }));
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<User | null> {
    const user = await this.userService.getUserById(Number(id));

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      ...user,
      avatar: `${baseUrl}/uploads/user/avatar/${user.avatar}`,
    };
  }
}
