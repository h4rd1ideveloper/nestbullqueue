import { Module } from '@nestjs/common';
import imports from './config/imports';
import controllers from './config/controllers';
import providers from './config/providers';

@Module({ imports, controllers, providers })
export class AppModule {}
