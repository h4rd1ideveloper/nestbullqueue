import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UserDTO } from '../user/user-dto';
import { InjectQueue } from '@nestjs/bull';
import { threadId } from 'worker_threads';

@Injectable()
class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private queue: Queue) {}

  async sendMail(user: UserDTO) {
    await this.queue.add('sendMail-job', user);
  }
}

export { SendMailProducerService };
