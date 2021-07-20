import { Body, Controller, Get } from '@nestjs/common';
import { UserDTO } from './user-dto';
import { SendMailProducerService } from '../jobs/sendMailProducerService';

@Controller('user')
export class UserController {
  constructor(private mailService: SendMailProducerService) {}

  @Get('/')
  async index(@Body() user: UserDTO) {
    await this.mailService.sendMail(user);
    return user;
  }
}
