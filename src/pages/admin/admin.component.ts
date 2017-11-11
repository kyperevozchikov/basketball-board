import {Component} from "@angular/core";
import {
  GameSettings, PeriodDurations, StatScoreItem, TeamFirstId, TeamInfo, TeamSecondId,
  TeamStat, TimerInfo
} from "../../classes/model/game-settings";
import {AdminService} from "../../classes/services/admin.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [AdminService]
})
export class AdminComponent{
  /**
   * Game settings property for set and view it in admin console
   */
  public gameSettings: GameSettings;

  /**
   * Period durations available list
   */
  public periodDurations: number[] = PeriodDurations;

  public teamFirstStat: TeamStat;
  public teamSecondStat: TeamStat;

  public isLeftTeamActive: boolean = true;

  public timerInfo: TimerInfo;
  public currentTime: string;
  public remainingMilliseconds: number;
  public isTimerActive: boolean;

  public timersQueue: TimerInfo[] = [];
  public currentTimerIndex: number;

  public scoreStat: StatScoreItem[] = [];
  public isSettingsTabActive: boolean = true;

  /**
   * Constructor of component
   * @param {AdminService} adminService
   */
  constructor(private adminService: AdminService){
    this.gameSettings = new GameSettings();
    this.gameSettings.teamFirst = new TeamInfo();
    this.gameSettings.teamSecond = new TeamInfo();

    // test only
    this.gameSettings.teamFirst.name = 'К. Советов';
    this.gameSettings.teamFirst.city = 'С.-Петербург';
    this.gameSettings.teamSecond.name = 'Тракторист';
    this.gameSettings.teamSecond.city = 'Челябинск';

    this.teamFirstStat = new TeamStat(TeamFirstId, 0, 0);
    this.teamSecondStat = new TeamStat(TeamSecondId, 0, 0);

    // subscribe to callback events from server wia web socket
    this.adminService.updateTimerEvent.subscribe((item: number) => {
      this.currentTime = DashboardComponent.durationToTime(item);
      this.remainingMilliseconds = item;

      if (this.remainingMilliseconds <= 0){
        this.isTimerActive = false;
      }
    }, error => {

    }, () =>{

    })

  }

  public onSubmit(): void{
    // prepare TimersQueue for looping periods and rests (timeouts) automatically
    this.timersQueue = [];
    this.timersQueue[0] = new TimerInfo(AdminComponent.minutesToMilliseconds(this.gameSettings.periodDuration), true, '1');
    this.timersQueue[1] = new TimerInfo(AdminComponent.minutesToMilliseconds(this.gameSettings.restFirst), false, 'Перерыв');
    this.timersQueue[2] = new TimerInfo(AdminComponent.minutesToMilliseconds(this.gameSettings.periodDuration), true, '2');
    this.timersQueue[3] = new TimerInfo(AdminComponent.minutesToMilliseconds(this.gameSettings.restSecond), false, 'Перерыв');
    this.timersQueue[4] = new TimerInfo(AdminComponent.minutesToMilliseconds(this.gameSettings.periodDuration), true, '3');
    this.timersQueue[5] = new TimerInfo(AdminComponent.minutesToMilliseconds(this.gameSettings.restThird), false, 'Перерыв');
    this.timersQueue[6] = new TimerInfo(AdminComponent.minutesToMilliseconds(this.gameSettings.periodDuration), true, '4');

    // send game settings (teams' info) to dashboard
    this.adminService.saveGameSettings(this.gameSettings);

    this.setTimer(this.currentTimerIndex = !!this.currentTimerIndex? this.currentTimerIndex : 0);
  }

  public setActiveArrow(isLeftArrow: boolean) {
    this.isLeftTeamActive = isLeftArrow;
    this.adminService.setNextInput(isLeftArrow ? TeamFirstId : TeamSecondId);
  }

  public setTeamFaults(teamId: number, offset: number) {
    if (teamId == TeamFirstId){
      this.teamFirstStat.faults += offset;
      this.updateTeamStat(this.teamFirstStat);
    }
    else {
      this.teamSecondStat.faults += offset;
      this.updateTeamStat(this.teamSecondStat);
    }
  }

  public setTeamScore(teamId: number, offset: number, statRecordWasRemoved: boolean = false) {
    if (teamId == TeamFirstId){
      this.teamFirstStat.score += offset;
      if (this.teamFirstStat.score < 0){
        this.teamFirstStat.score = 0;
      }

      this.updateTeamStat(this.teamFirstStat);
    }
    else {
      this.teamSecondStat.score += offset;
      if (this.teamSecondStat.score < 0){
        this.teamSecondStat.score = 0;
      }

      this.updateTeamStat(this.teamSecondStat);
    }

    if (statRecordWasRemoved){
      return;
    }

    if (offset > 0) {
      // add new stat record
      const message = `Период ${this.timerInfo.title}, время: ${DashboardComponent.durationToTime(this.timerInfo.duration - this.remainingMilliseconds)}, команда: ${teamId == TeamFirstId ? this.gameSettings.teamFirst.name : this.gameSettings.teamSecond.name}`;
      this.scoreStat.push(new StatScoreItem(teamId, message, offset));
    }
    else {
      // correct last record for given teamId
      let lastRecord: StatScoreItem = null;
      for(let idx = this.scoreStat.length - 1; idx >=0 ; idx--){
        if (this.scoreStat[idx].teamId == teamId){
          lastRecord = this.scoreStat[idx];
          break;
        }
      }

      if (lastRecord == null){
        return;
      }

      lastRecord.scores = lastRecord.scores + offset; // because offset is a negative number;

      // and if it has zero score - remove it
      if (lastRecord.scores == 0){
        this.scoreStat = this.scoreStat.filter(value => value.scores != 0);
      }
    }
  }

  public removeScoreStatItem(index: number){
    const item = this.scoreStat[index];
    // create new array
    this.scoreStat[index]= null;
    this.scoreStat = this.scoreStat.filter((value => value != null));

    this.setTeamScore(item.teamId, -item.scores, true);
  }

  public setTimer(timerIndex : number){
    // we need to stop current timer
    this.stopTimer();

    // and then we can set a new one
    if (this.timersQueue.length > timerIndex && timerIndex >= 0) {
      this.timerInfo = this.timersQueue[timerIndex];
      this.currentTimerIndex = timerIndex;
      this.currentTime = DashboardComponent.durationToTime(this.timerInfo.duration);
      this.remainingMilliseconds = this.timerInfo.duration;
      this.adminService.setCurrentTimer(this.timerInfo);
    }
  }

  public startTimer(): void{
    if (this.remainingMilliseconds > 0){
      this.adminService.startTimer();
      this.isTimerActive = true;
    }
  }

  public stopTimer(): void{
    this.adminService.stopTimer();
    this.isTimerActive = false;
  }

  private updateTeamStat(teamStat: TeamStat): void{
    this.adminService.updateTeamStat(teamStat);
  }

  private static minutesToMilliseconds(minutes: number): number{
    return minutes * 60 * 1000;
  }

  public setSettingsTabActive(isSettingsTabActive: boolean) {
    this.isSettingsTabActive = isSettingsTabActive;
  }
}
