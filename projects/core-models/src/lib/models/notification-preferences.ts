export type NotificationCode =
  'task_assigned' | 'task_due_soon' | 'task_overdue' | 'task_completed' | 'task_reopened' | 'task_updated' |
  'case_opened' | 'case_assigned' | 'case_closed' | 'case_reopened' |
  'customer_intake_completed' |
  'invoice_created' | 'invoice_paid' | 'invoice_overdue' | 'payment_partial' | 'payment_failed' | 'retainer_low' |
  'document_shared' | 'document_action_required' | 'document_completed' |
  'case_member_added' | 'case_member_removed' |
  'account_changed' | 'subscription_billing_problem';

export type NotificationCategory = 'tasks' | 'cases' | 'clients' | 'billing' | 'documents' | 'team' | 'account';

export interface NotificationPreference {
  code: NotificationCode;
  category: NotificationCategory;
  /** El dashboard es obligatorio: el backend siempre lo devuelve en true. */
  dashboard: boolean;
  email: boolean;
}

export interface NotificationPreferences {
  subscription: string;
  preferences: NotificationPreference[];
}
