import * as Bull from 'bull';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { envs } from './constantes';
import { BullModuleOptions } from '@nestjs/bull/dist/interfaces/bull-module-options.interface';

export function bullOptions(): Bull.QueueOptions {
  const { redis } = envs();
  return { redis };
}

export function mailerOptions(): MailerOptions {
  const { mailer: transport } = envs();
  return { transport };
}

export const queueName = { name: 'sendMail-queue' } as BullModuleOptions;
