import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {GameSettings, TeamStat, TimerInfo} from "../model/game-settings";
import {Events} from "../model/events";

@Injectable()
export class AdminService extends BaseService {

  constructor(){
    super();
  }

  public saveGameSettings(gameSettings: GameSettings): void{
    this.socket.emit(Events.SetGameInfoEvent, gameSettings, () => {
      console.debug('games settings was successfully sent to server');
    });
  }

  public updateTeamStat(teamStat: TeamStat): void{
    this.socket.emit(Events.UpdateTeamStatEvent, teamStat, () => {
      console.debug('team stat was successfully sent to server');
    });
  }

  public setNextInput(teamId: number): void{
    this.socket.emit(Events.SetNextInputEvent, teamId, () => {
      console.debug('next input was successfully sent to server');
    });
  }

  public setCurrentTimer(timerInfo: TimerInfo): void{
    this.socket.emit(Events.TimerSetEvent, timerInfo, () => {
      console.debug('timer info was successfully sent to server');
    });
  }

  public startTimer(): void{
    this.socket.emit(Events.TimerStartEvent, () => {
      console.debug('timer info was successfully sent to server');
    });
  }

  public stopTimer(): void{
    this.socket.emit(Events.TimerPauseEvent, () => {
      console.debug('timer info was successfully sent to server');
    });
  }
}
