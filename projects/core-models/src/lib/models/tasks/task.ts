export interface Tasks {
    uuid?: string;
    expedientId: string;
    collaboratorId: string;
    clientId: string;

    expedientName?: string;
    clientName?: string;
    collaboratorName?: string;

    description: string;
    hours: number;
    type: TaskType;
    state: TaskState;
    periodicity:TaskPeriodicity;
    completed:boolean;

    personName?: string;
    startDate?: Date;
    endDate?: Date;

    pricePerHour: number;
    quotedHours: number;
};

export enum TaskType {
    Call,
    Date,
    Chat,
    Mail,
    Consult,
    Document,
};

export enum TaskState {
    Pending = 1,
    Completed,
    Overdue
}
  
export enum TaskPeriodicity {
    Daily,
    Weekly,
    Monthly,
    Yearly
}

export interface TaskHour {
    uuid?:string;
    expedientId:string;
    userId:string;
    pricePerHour:number;
    quotedHours:number;
    isBillable:boolean;
    description:string;
    createdAt?:Date;
    state:TaskHourState;
}

export enum TaskHourState {
    Billed,
    Unbilled
}