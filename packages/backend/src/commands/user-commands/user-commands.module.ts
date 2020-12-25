import { Module, forwardRef } from '@nestjs/common';
import { UserCommandsService } from './user-commands.service';
import { HelpService } from './commands/help.service';
import { RollService } from './commands/roll.service';
import { UserInteractionsService } from './commands/userInteractions.service';
import { RedisAdapterModule } from '../../redis-adapter/redis-adapter.module';
import { CreateRoomService } from './commands/create-room.service';
import { LobbyModule } from '../../lobby/lobby.module';

@Module({
  imports: [RedisAdapterModule, forwardRef(() => LobbyModule)],
  providers: [
    UserCommandsService,
    HelpService,
    RollService,
    CreateRoomService,
    UserInteractionsService,
  ],
  exports: [UserCommandsService],
})
class UserCommandsModule {}

export default UserCommandsModule;
