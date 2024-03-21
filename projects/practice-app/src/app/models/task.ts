
export interface CurrentTaskTimeInfo {
  task?:           string;
  title?:          string;
  description?:    string;
  executedBy?:    string;
  startAt:       Date;
  notBillable?:   boolean;
  expiredAt:      Date;
}
