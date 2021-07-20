import { Module } from "@nestjs/common";
import imports from "./modules/imports";
import controllers from "./modules/controllers";
import providers from "./modules/providers";

@Module({ imports, controllers, providers })
export class AppModule {
}
