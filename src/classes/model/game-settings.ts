/* Defines common game settings */
export class GameSettings{
  /* Team first */
  public teamFirst: TeamInfo;

  /* Team second */
  public teamSecond: TeamInfo;

  /* Period's duration (in minutes) */
  public periodDuration: number = PeriodDurations[0];

  /** Durations of rest (in minutes):
   * restFirst - rest's duration between first and second periods
   * restSecond - rest's duration between second and third periods
   * restThird - rest's duration between third and fourth periods
   **/
  public restFirst: number = 2;
  public restSecond: number = 10;
  public restThird: number = 2;
}

/* Team info */
export class TeamInfo{
  public name: string;
  public city: string;
}

/* List of available period's durations */
export const PeriodDurations:number[] = [8, 10];

/* A period statistics */
export class PeriodStat{
  public currentTime: number;
  public teamFirstStat: TeamStat;
  public teamSecondStat: TeamStat;
}

/* A game statistics */
export class GameStat{
  public periods: PeriodStat[];
  public currentPeriodNumber: number;
  public teamFirstTotalStat: TeamStat;
  public teamSecondTotalStat: TeamStat;
}

/* A team statistics */
export class TeamStat{
  constructor(public teamId:number,
              public score:number,
              public faults:number){
  }
}

export class TimerInfo{
  constructor(public duration: number,
              public isPeriod: boolean,
              public title: string){}
}

export class StatScoreItem{
  constructor(public teamId: number,
              public message: string,
              public scores: number){}
}

export const TeamFirstId: number = 1;
export const TeamSecondId: number = 2;
