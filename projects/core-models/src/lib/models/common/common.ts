export interface Country{
  uuid:string,
  code:string,
  name:string
}

export interface Occupation {
  uuid: string;
  code: string;
  name: string;
}

export enum WeekDays {
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
  Saturday = 7,
  Sunday = 1
 }

 export const WeekDaysDescription = new Map<number, string>([
   [WeekDays.Monday, 'Monday'],
   [WeekDays.Tuesday, 'Tuesday'],
   [WeekDays.Wednesday, 'Wednesday'],
   [WeekDays.Thursday, 'Thursday'],
   [WeekDays.Friday, 'Friday'],
   [WeekDays.Saturday, 'Saturday'],
   [WeekDays.Sunday, 'Sunday'],

 ]);

