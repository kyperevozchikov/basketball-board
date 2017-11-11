import {EventEmitter} from "@angular/core";
import {GameSettings, TeamStat, TimerInfo} from "../model/game-settings";
import * as io from "socket.io-client";
import {Events} from "../model/events";

export abstract class BaseService {
  protected socket: SocketIOClient.Socket;
  public setTimerEvent: EventEmitter<TimerInfo> = new EventEmitter<TimerInfo>();
  public updateTimerEvent: EventEmitter<number> = new EventEmitter<number>();
  public updateTeamStatEvent: EventEmitter<TeamStat> = new EventEmitter<TeamStat>();
  public setNextInputEvent: EventEmitter<number> = new EventEmitter<number>();
  public setGameInfoEvent: EventEmitter<GameSettings> = new EventEmitter<GameSettings>();

  constructor() {
    this.socket = io();
    this.init();
  }

  init(): void {
    this.socket.on(Events.TimerSetEvent, (data) => {
      console.debug(data);
      this.setTimerEvent.emit(data);
    });
    this.socket.on(Events.TimerUpdateEvent, (data) => {
      console.debug(data);
      this.updateTimerEvent.emit(data);
    });
    this.socket.on(Events.UpdateTeamStatEvent, (data) => {
      console.debug(data);
      this.updateTeamStatEvent.emit(data);
    });
    this.socket.on(Events.SetNextInputEvent, (data) => {
      console.debug(data);
      this.setNextInputEvent.emit(data);
    });
    this.socket.on(Events.SetGameInfoEvent, (data) => {
      console.debug(data);
      this.setGameInfoEvent.emit(data);
    });
  }

  public destroy(): void {
    this.socket.disconnect();
  }
}
