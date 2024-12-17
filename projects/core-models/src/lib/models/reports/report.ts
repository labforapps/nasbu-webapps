import { InvoiceStatus } from "../accounting";
import { BillingType, CaseFileStatus } from "../practice";

export interface ReportBasePayload {
  subscription: string;
  report_name:  string;
  period:       string | null;
  format:       ReportFormat;
  start_date:   string | null;
  end_date:     string | null;
}

export interface ReportInvoicingPayload extends ReportBasePayload {
  customer:     string | null;
  lawyer:       string | null;
  billing_type: BillingType | null;
  status:       InvoiceStatus | null;
}

export interface ReportCaseFilePayload extends ReportBasePayload {
  customer:  string | null;
  case_file: string | null;
  lawyer:    string | null;
  status:    CaseFileStatus | null;
}

export interface ReportCustomerWalletDetails extends ReportBasePayload {
  customer:  string | null;
  case_file: string | null;
}

export interface ReportPaymentsPayload extends ReportBasePayload {
  customer:  string | null;
  billing_type: string | null;
  lawyer: null
}

export interface ReportGeneralMetricsPayload extends ReportBasePayload {
}

export interface ResponseGeneralReport {
  total_documents_count:     number;
  total_invoices_count:      number;
  total_case_files_count:    number;
  total_users:               number;
  total_payments_amt:        string;
  total_tasks:               number;
  total_hours_saved:         number;
  total_customer_percentage: number;
  start_date:                Date;
  end_date:                  Date;
}



export enum ReportFormat {
  HTML = 'html',
  PDF = 'pdf',
  JSON = 'json'
}

export interface DayPeriod {
  code:string,
  name:string,
  total_days_to_substract:number
}

export const DaysPeriod:DayPeriod[] = [
  {
    'code': 'last_seven_days',
    'name': 'Últimos 7 días',
    'total_days_to_substract': 7
  },
  {
      'code': 'this_month',
      'name': 'Este mes',
      'total_days_to_substract': 30
  },
  {
      'code': 'last_three_months',
      'name': 'Hace 3 meses',
      'total_days_to_substract': 90
  },
  {
      'code': 'last_six_months',
      'name': 'Hace 6 meses',
      'total_days_to_substract': 180
  },
  {
      'code': 'last_year',
      'name': 'Hace 12 meses',
      'total_days_to_substract': 365
  }
]
