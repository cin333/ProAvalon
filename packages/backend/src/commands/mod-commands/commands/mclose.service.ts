import { Injectable } from '@nestjs/common';
import { SocketUser } from '../../../users/users.socket';
import { emitCommandResponse } from '../../commandResponse';
import { Command } from '../../commands.types';
import { LobbyService } from '../../../lobby/lobby.service';

@Injectable()
export class MCloseService implements Command {
  command = 'mclose';

  help = '/mclose <gameId> [<gameId> <gameId> ...]: Closes the given games.';

  constructor(private readonly lobbyService: LobbyService) {}

  async run(socket: SocketUser, data: string[]) {
    if (data.length === 0) {
      emitCommandResponse('You must provide at least one gameId', socket);
      return;
    }

    const promises: (Promise<boolean> | boolean)[] = [];

    for (const gameId of data) {
      const gameIdNum = parseInt(gameId, 10);
      if (Number.isNaN(gameIdNum)) {
        promises.push(false);
      } else {
        promises.push(this.lobbyService.closeGame(gameIdNum));
      }
    }

    const responses = await Promise.all(promises);

    for (const [i, res] of responses.entries()) {
      if (res) {
        emitCommandResponse(`Closed game ${data[i]}.`, socket);
      } else {
        emitCommandResponse(`Failed to close game ${data[i]}.`, socket);
      }
    }

    this.lobbyService.updateLobbyGames();
  }
}
