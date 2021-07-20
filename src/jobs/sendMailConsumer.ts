import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserDTO } from '../user/user-dto';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob({ data: { email, name } }: Job<UserDTO>) {
    await this.mailService.sendMail({
      to: email,
      from: 'Yan Policarpo Dev <yan.policarpo@beedoo.com.br>',
      subject: `Seja bem vindo(a) ${name}`,
      text: `Olá ${name}, <${email}>`,
    });
  }
}

export { SendMailConsumer };
