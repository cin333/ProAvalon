import axios, { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest, fork } from 'redux-saga/effects';
import { Event } from '@proavalon/proto';
import {
  ChatResponse,
  ChatRequest,
  LobbyEventType,
} from '@proavalon/proto/lobby';
import { RoomEventType } from '@proavalon/proto/room';

import { socket } from '../../socket';

import { getBackendUrl } from '../../utils/getEnvVars';
import { setMessages } from './actions';
import { GET_ALL_CHAT, EMIT_MESSAGE, IEmitMessageAction } from './types';
import { clientCommand } from './clientCommand';

const get = async (
  path: string,
): Promise<AxiosResponse<ChatResponse[]> | ChatResponse[]> => {
  const url = `${getBackendUrl()}${path}`;

  return axios({
    method: 'get',
    url,
    // responseType: 'arraybuffer',
  }).then((resp) => resp.data);
};

function* emitMessage({
  payload: { type, message },
}: IEmitMessageAction): SagaIterator {
  const data: ChatRequest = {
    text: message,
  };

  const eventType =
    type === 'lobby'
      ? LobbyEventType.ALL_CHAT_TO_SERVER
      : RoomEventType.ROOM_CHAT_TO_SERVER;

  const event: Event = {
    type: eventType,
    data,
  };

  if (clientCommand(message)) {
    return;
  }

  if (type === 'lobby') {
    yield call(socket.emit, LobbyEventType.LOBBY_EVENT, event);
  } else {
    yield call(socket.emit, RoomEventType.ROOM_EVENT, event);
  }
}

function* getAllChat(): SagaIterator {
  const chatResponses = (yield call(get, '/allchat')) as ChatResponse[];

  for (let i = 0; i < chatResponses.length; i += 1) {
    chatResponses[i].timestamp = new Date(chatResponses[i].timestamp);
  }

  // eslint-disable-next-line no-console
  console.log(chatResponses);
  yield put(setMessages({ type: 'lobby', messages: chatResponses }));
}

function* watchEmitMessage(): SagaIterator {
  yield takeLatest(EMIT_MESSAGE, emitMessage);
}

function* watchGetAllChat(): SagaIterator {
  yield takeLatest(GET_ALL_CHAT, getAllChat);
}

export function* chatSaga(): SagaIterator {
  yield fork(watchEmitMessage);
  yield fork(watchGetAllChat);
}
