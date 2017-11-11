import {Component, OnDestroy, OnInit} from "@angular/core";
import {DashboardService} from "../../classes/services/dashboard.service";
import {
  GameSettings, TeamFirstId, TeamInfo, TeamSecondId, TeamStat,
  TimerInfo
} from "../../classes/model/game-settings";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit, OnDestroy{
  public teamFirstStat: TeamStat;
  public teamSecondStat: TeamStat;
  public teamFirstInfo: TeamInfo;
  public teamSecondInfo: TeamInfo;

  public firstTeamFaults: string[];
  public secondTeamFaults: string[];

  // initially we don't know who will be next input
  public nextInputTeamId:number = 0;
  public timerInfo: TimerInfo;
  public currentTime: string;
  public remainingMilliseconds: number;

  constructor(private dataService: DashboardService){
    this.dataService.updateTeamStatEvent.subscribe((item: TeamStat) => {
      if (item.teamId == 1){
        this.teamFirstStat = item;
        this.firstTeamFaults = DashboardComponent.prepareFaultsArray(this.teamFirstStat.faults);
      }
      else {
        this.teamSecondStat = item;
        this.secondTeamFaults = DashboardComponent.prepareFaultsArray(this.teamSecondStat.faults);
      }
    }, error => {

    }, () =>{

    })
    this.dataService.setGameInfoEvent.subscribe((item: GameSettings) => {
      this.teamFirstInfo = item.teamFirst;
      this.teamSecondInfo = item.teamSecond;
    }, error => {

    }, () =>{

    })

    this.dataService.setNextInputEvent.subscribe((item: number) => {
      this.nextInputTeamId = item;
    }, error => {

    }, () =>{

    })

    this.dataService.setTimerEvent.subscribe((item: TimerInfo) => {
      this.timerInfo = item;
      this.currentTime = DashboardComponent.durationToTime(item.duration);
    }, error => {

    }, () =>{

    })

    this.dataService.updateTimerEvent.subscribe((item: number) => {
      this.currentTime = DashboardComponent.durationToTime(item);
      this.remainingMilliseconds = item;
    }, error => {

    }, () =>{

    })
  }

  ngOnInit(): void {
    this.clearStat();
  }

  ngOnDestroy(): void {
    this.dataService.destroy();
  }

  private clearStat(): void {
    this.teamFirstStat = new TeamStat(TeamFirstId, 0, 0);
    this.teamSecondStat = new TeamStat(TeamSecondId, 0, 0);
    this.nextInputTeamId = 0;
    this.firstTeamFaults = ["0", "0", "0", "0", "0"];
    this.secondTeamFaults = ["0", "0", "0", "0", "0"];
  }

  private static prepareFaultsArray(faults: number):string[]{
    let faultsArray = ["0", "0", "0", "0", "0"];

    for (let i=0; i < faults; i++){
      faultsArray[i] = 'X';
    }

    return faultsArray;
  }

  static durationToTime(durationInMS: number): string{
    return `${DashboardComponent.pad(Math.floor(durationInMS / 60000))}:${DashboardComponent.pad(Math.floor(durationInMS / 1000 % 60))}.${Math.floor(durationInMS / 100 % 10)}`;
  }

  private static pad(val: number): string {
    let valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
}
