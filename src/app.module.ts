import { Module } from "@nestjs/common";
import { UserController } from "./user/user.controller";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379
      }
    })
  ],
  controllers: [UserController],
  providers: []
})
export class AppModule {
}
