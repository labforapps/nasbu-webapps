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

 export enum SendingMethod {
  Email = 'email',
  SMS = 'sms'
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

 export interface TaskType{
  uuid?: string;
  type: TaskTypeEnum;
  name: string;
  icon?: null;
 }


 export enum TaskTypeEnum {
  CALL = "call",
  APPOINTMENT = "appointment",
  SEND_EMAIL = "send_email",
  GIVE_CONSULTATION = "give_consultation",
  WRITE_DOCUMENT = "write_document",
  FILING = "filing",
  APPEAR_ON_SIGHT = "appear_on_sight",
  MEETING = "meeting",
  RESEARCH = "research",
  LECTURE = "lecture",
  OTHER = "other",
}


export const TaskTypeDescripcion = new Map<string, string>([
  [TaskTypeEnum.CALL, "Llamada"],
  [TaskTypeEnum.APPOINTMENT, "Coordinar cita"],
  [TaskTypeEnum.SEND_EMAIL, "Enviar correo"],
  [TaskTypeEnum.GIVE_CONSULTATION, "Ofrecer consulta"],
  [TaskTypeEnum.WRITE_DOCUMENT, "Redactar documento"],
  [TaskTypeEnum.FILING, "Radicación"],
  [TaskTypeEnum.APPEAR_ON_SIGHT, "Comparecer a vista"],
  [TaskTypeEnum.MEETING, "Reunión"],
  [TaskTypeEnum.RESEARCH, "Investigación"],
  [TaskTypeEnum.LECTURE, "Lectura"],
  [TaskTypeEnum.OTHER, "Otros"],
]);

export const TaskTypeiIconClassMap: Map<string, string> = new Map([
  [TaskTypeEnum.CALL, "icon-phone"],
  [TaskTypeEnum.APPOINTMENT, "icon-task-list"],
  [TaskTypeEnum.SEND_EMAIL, "icon-email"],
  [TaskTypeEnum.GIVE_CONSULTATION, "icon-chat"],
  [TaskTypeEnum.WRITE_DOCUMENT, "icon-document-color"],
  [TaskTypeEnum.FILING, "icon-swap"],
  [TaskTypeEnum.APPEAR_ON_SIGHT, "icon-law"],
  [TaskTypeEnum.MEETING, "icon-meeting"],
  [TaskTypeEnum.RESEARCH, "icon-sunglasses"],
  [TaskTypeEnum.LECTURE, "icon-open-book"],
  [TaskTypeEnum.OTHER, "icon-more"],
]);

export const TaskTypeIconSVG: Map<string, string> = new Map([
  [TaskTypeEnum.CALL, "phone-call"],
  [TaskTypeEnum.APPOINTMENT, "appoinment"],
  [TaskTypeEnum.SEND_EMAIL, "send_email"],
  [TaskTypeEnum.GIVE_CONSULTATION, "consultation"],
  [TaskTypeEnum.WRITE_DOCUMENT, "write_document"],
  [TaskTypeEnum.FILING, "radication"],
  [TaskTypeEnum.APPEAR_ON_SIGHT, "appear_on_sight"],
  [TaskTypeEnum.MEETING, "meeting"],
  [TaskTypeEnum.RESEARCH, "research"],
  [TaskTypeEnum.LECTURE, "lecture"],
  [TaskTypeEnum.OTHER, "others"],
]);

export enum Action {
  CREATE = 'create',
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete'
}


