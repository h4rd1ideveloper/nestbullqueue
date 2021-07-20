import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { bullOptions, mailerOptions, queueName } from '../index';
import { MailerModule } from '@nestjs-modules/mailer';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

export default [
  ConfigModule.forRoot(),
  BullModule.forRoot(bullOptions()),
  BullModule.registerQueue(queueName),
  MailerModule.forRoot(mailerOptions()),
] as Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>;
