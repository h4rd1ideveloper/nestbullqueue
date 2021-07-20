import { SendMailProducerService } from '../jobs/sendMailProducerService';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { SendMailConsumer } from '../jobs/sendMailConsumer';

export default [SendMailProducerService, SendMailConsumer] as Provider[];
