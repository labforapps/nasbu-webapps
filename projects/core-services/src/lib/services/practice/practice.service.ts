import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CaseFile, CaseFileDocument, CaseFileNote,
         CaseFileWalletDetail,CaseFilePayload, CaseFileDocumentPayload,
         CaseFileAccess, CaseFileWalletDetailType, Customer, Task, TimeTask, TaskPayload,SecurityUser, TaskStatus, DocumentTemplate,
         DocumentGeneration, DocumentGenerationPayload, DocumentTemplatePayload } from 'core-models';
import { CustomersService } from '../catalog/customers.service';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { CommonService } from '../common';
import { SecurityService } from '../security/security.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {

  private caseFileWalletDetailType = CaseFileWalletDetailType;
  taskStatus = TaskStatus;

  constructor(@Inject('config') private config: any,
  private httpClient: HttpClient,
  private customerService:CustomersService,
  private commonService:CommonService,
  private securityService:SecurityService) { }

  getCaseFiles(subscription:string):Observable<CaseFile[]>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/?subscription=${subscription}`;
    return this.httpClient.get<CaseFile[]>(serverUrl).pipe(
      map((caseFiles:CaseFile[]) => {
        return caseFiles.sort((a, b) => {
            let dateA = new Date(a.created_at || '').getTime();
            let dateB = new Date(b.created_at || '').getTime();
            return dateB - dateA;
        });
      })
    );
  }

  getCaseFileById(subscription:string,uuid:string):Observable<CaseFile>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/?subscription=${subscription}`;
    return this.httpClient.get<CaseFile>(serverUrl);
  }

  createCaseFile(subscription:string,caseFilePayload:CaseFilePayload):Observable<CaseFile>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/?subscription=${subscription}`;
    return this.httpClient.post<CaseFile>(serverUrl,caseFilePayload);
  }

  saveCaseFile(caseFilePayload: CaseFilePayload): Observable<CaseFile> {
    let saveOperation$: Observable<CaseFile>;
    const payload: CaseFilePayload = { ...caseFilePayload };
    if (caseFilePayload.uuid != null && caseFilePayload.uuid !== '') {
      saveOperation$ = this.updateCaseFile(payload.subscription || '',payload,payload.uuid || '');
    } else {
      saveOperation$ = this.createCaseFile(caseFilePayload.subscription || '', payload).pipe(
        switchMap((caseFile: CaseFile) => this.createWalletDetailByCreatingCaseFile(caseFile))
      );
    }
    return saveOperation$;
  }

  createWalletDetailByCreatingCaseFile(caseFile:CaseFile):Observable<CaseFile>{

    if (!caseFile.receive_retainer) {
      return of(caseFile);
    }

    return this.customerService.getCustomerById(caseFile.subscription, caseFile.customer.uuid || '').pipe(
      tap((data: Customer) => {
        const caseFileWalletDetailPayload: CaseFileWalletDetail = {
          description: 'Monto de Retencion',
          amt: caseFile.retainer_amt,
          type: this.caseFileWalletDetailType.CREDIT,
          case_file: caseFile.uuid || '',
          wallet: data.wallet || '',
          subscription: caseFile.subscription
        }

        this.createCaseFileWalletDetail(caseFile.subscription, caseFileWalletDetailPayload);
      }),
      map(() => caseFile)
    );

  }

  updateCaseFile(subscription:string,caseFilePayload:CaseFilePayload,uuid:string):Observable<CaseFile>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/?subscription=${subscription}`;
    return this.httpClient.put<CaseFile>(serverUrl,caseFilePayload);
  }

  updateCaseFileChangeStatus(caseFilePayload:CaseFile):Observable<CaseFile>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${caseFilePayload.uuid}/change_status/?subscription=${caseFilePayload.subscription}`;
    return this.httpClient.put<CaseFile>(serverUrl,caseFilePayload);
  }

  deleteCaseFile(subscription:string,uuid:string):Observable<CaseFile>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/?subscription=${subscription}`;
    return this.httpClient.delete<CaseFile>(serverUrl);
  }

  getCaseFileDocuments(subscription:string,uuid:string):Observable<CaseFileDocument[]>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/documents/?subscription=${subscription}`;
    return this.httpClient.get<CaseFileDocument[]>(serverUrl);
  }

  createCaseFileDocument(createCaseFileDocument: CaseFileDocumentPayload):Observable<CaseFileDocument> {
    const serverUrl = `${this.config.serverUrl}/practice/case_files_documents/?subscription=${createCaseFileDocument.subscription}`;
    const formData = new FormData();
    formData.append('document', createCaseFileDocument.document || '');
    formData.append('case_file', createCaseFileDocument.case_file);
    formData.append('subscription', createCaseFileDocument.subscription);
    formData.append('document_name', createCaseFileDocument.document_name);
    return this.httpClient.post<CaseFileDocument>(serverUrl, formData);
  }

  deleteCaseFileDocuments(subscription:string,uuid:string){
    const serverUrl = `${this.config.serverUrl}/practice/case_files_documents/${uuid}?subscription=${subscription}`;
    return this.httpClient.delete<CaseFileDocument>(serverUrl);
  }

  getCaseFileNotes(subscription:string,uuid:string):Observable<CaseFileNote[]>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/notes/?subscription=${subscription}`;
    return this.httpClient.get<CaseFileNote[]>(serverUrl);
  }

  createCaseFileNote(subscription:string,caseFileNotePayload:CaseFileNote):Observable<CaseFileNote> {
    const serverUrl = `${this.config.serverUrl}/practice/case_files_notes/?subscription=${subscription}`;
    return this.httpClient.post<CaseFileNote>(serverUrl,caseFileNotePayload);
  }

  getCaseFileNoteById(subscription:string,uuid:string):Observable<CaseFileNote>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files_notes/${uuid}?subscription=${subscription}`;
    return this.httpClient.get<CaseFileNote>(serverUrl);
  }

  updateCaseFileNote(subscription:string,uuid:string,caseFileNotePayload:CaseFileNote):Observable<CaseFileNote>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files_notes/${uuid}/?subscription=${subscription}`;
    return this.httpClient.put<CaseFileNote>(serverUrl,caseFileNotePayload);
  }

  saveCaseFileNote(caseFileNotePayload: CaseFileNote): Observable<CaseFileNote> {
    let saveOperation$: Observable<CaseFileNote>;
    const payload: CaseFileNote = { ...caseFileNotePayload };
    if (caseFileNotePayload.uuid != null && caseFileNotePayload.uuid !== '') {
      saveOperation$ = this.updateCaseFileNote(payload.subscription || '',payload.uuid || '',payload);
    } else {
      saveOperation$ = this.createCaseFileNote(caseFileNotePayload.subscription || '', payload);
    }
    return saveOperation$;
  }

  deleteCaseFileNote(subscription:string,uuid:string):Observable<CaseFileNote>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files_notes/${uuid}?subscription=${subscription}`;
    return this.httpClient.delete<CaseFileNote>(serverUrl);
  }

  getCaseFileWalletDetails(subscription:string,uuid:string):Observable<CaseFileWalletDetail[]>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/wallet_details/?subscription=${subscription}`;
    return this.httpClient.get<CaseFileWalletDetail[]>(serverUrl);
  }

  createCaseFileWalletDetail(subscription:string,caseFileWalletDetail:CaseFileWalletDetail):Observable<CaseFileWalletDetail> {
    const serverUrl = `${this.config.serverUrl}/catalog/customer_wallet_details/?subscription=${subscription}`;
    return this.httpClient.post<CaseFileWalletDetail>(serverUrl,caseFileWalletDetail);
  }

  updateCaseFileWalletDetail(subscription:string,caseFileWalletDetail:CaseFileWalletDetail):Observable<CaseFileWalletDetail> {
    const serverUrl = `${this.config.serverUrl}/catalog/customer_wallet_details/${caseFileWalletDetail.uuid}/?subscription=${subscription}`;
    return this.httpClient.put<CaseFileWalletDetail>(serverUrl,caseFileWalletDetail);
  }

  saveCaseFileWalletDetail(caseFileWalletDetail: CaseFileWalletDetail): Observable<CaseFileWalletDetail> {
    let saveOperation$: Observable<CaseFileWalletDetail>;
    const payload: CaseFileWalletDetail = { ...caseFileWalletDetail };
    if (caseFileWalletDetail.uuid != null && caseFileWalletDetail.uuid !== '') {
      saveOperation$ = this.updateCaseFileWalletDetail(payload.subscription || '',payload);
    } else {
      saveOperation$ = this.createCaseFileWalletDetail(caseFileWalletDetail.subscription || '', payload);
    }
    return saveOperation$;
  }

  deleteCaseFileWalletDetail(subscription:string,uuid:string):Observable<CaseFileWalletDetail> {
    const serverUrl = `${this.config.serverUrl}/catalog/customer_wallet_details/${uuid}?subscription=${subscription}`;
    return this.httpClient.delete<CaseFileWalletDetail>(serverUrl);
  }

  createCaseFileAccess(caseFileAccess:CaseFileAccess):Observable<CaseFileAccess> {
    const serverUrl = `${this.config.serverUrl}/practice/case_files_access/?subscription=${caseFileAccess.subscription}`;
    return this.httpClient.post<CaseFileAccess>(serverUrl,caseFileAccess);
  }

  deleteCaseFileAccess(caseFileAccess:CaseFileAccess):Observable<CaseFileAccess> {
    const serverUrl = `${this.config.serverUrl}/practice/case_files_access/${caseFileAccess.uuid}?subscription=${caseFileAccess.subscription}`;
    return this.httpClient.delete<CaseFileAccess>(serverUrl);
  }

  downloadCaseFileDocument(caseFileDocument:CaseFileDocument):Observable<any>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files_documents/${caseFileDocument.uuid}/download?subscription=${caseFileDocument.subscription}`;
    return this.httpClient.get(serverUrl,{ responseType: 'blob' });
  }


  getTasks(subscription:string):Observable<Task[]>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks/?subscription=${subscription}`;
    const currentDate = new Date();

    return this.httpClient.get<Task[]>(serverUrl).pipe(
      switchMap((tasks: Task[]) => {
          tasks.forEach((task: Task) => {
            if(task.status === this.taskStatus.OPEN){
              const endDate = new Date(task.end_date + 'T00:00:00');
              task.overdue = endDate.setHours(0,0,0,0) < currentDate.setHours(0,0,0,0);
            }
          });

            return of(tasks.sort((a, b) => {
              let dateA = new Date(a.created_at || '').getTime();
              let dateB = new Date(b.created_at || '').getTime();
              return dateB - dateA;
          }));
      })
    );
  }


  getTaskById(subscription:string,uuid:string):Observable<Task[]>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks/${uuid}?subscription=${subscription}`;
    return this.httpClient.get<Task[]>(serverUrl);
  }

  createTask(task:TaskPayload):Observable<Task>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks/?subscription=${task.subscription}`;
    return this.httpClient.post<Task>(serverUrl,task);
  }

  updateTask(task:TaskPayload){
    const serverUrl = `${this.config.serverUrl}/practice/tasks/${task.uuid}/?subscription=${task.subscription}`;
    return this.httpClient.put<Task>(serverUrl,task);
  }

  saveTask(task: TaskPayload): Observable<Task> {
    let saveOperation$: Observable<Task>;
    const payload: TaskPayload = { ...task };
    if (task.uuid != null && task.uuid !== '') {
      saveOperation$ = this.updateTask(payload);
    } else {
      saveOperation$ = this.createTask( payload);
    }
    return saveOperation$;
  }

  deleteTask(subscription:string,uuid:string):Observable<Task>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks/${uuid}?subscription=${subscription}`;
    return this.httpClient.delete<Task>(serverUrl);
  }

  getTasksTime(subscription:string):Observable<TimeTask[]>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks_time_details/?subscription=${subscription}`;
    return this.httpClient.get<TimeTask[]>(serverUrl).pipe(
      switchMap((taskTime: TimeTask[]) => {
        return this.securityService.getSecurityUsers(subscription).pipe(
          switchMap((securityUsers: SecurityUser[]) => {
            taskTime.forEach((taskTime: TimeTask) => {
              const securityUser = securityUsers.find((type: SecurityUser) => type.uuid === taskTime.executed_by);
              taskTime.user = securityUser;
            });

            return of(taskTime.sort((a, b) => {
              let dateA = new Date(a.created_at || '').getTime();
              let dateB = new Date(b.created_at || '').getTime();
              return dateB - dateA;
          }));
          })
        );
      })
    );
  }

  getTasksTimeByTask(task:Task):Observable<TimeTask[]>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks/${task.uuid}/time_details?subscription=${task.subscription}`;
    return this.httpClient.get<TimeTask[]>(serverUrl);
  }

  getTaskTimeById(subscription:string,uuid:string):Observable<TimeTask[]>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks_time_details/${uuid}?subscription=${subscription}`;
    return this.httpClient.get<TimeTask[]>(serverUrl);
  }

  createTaskTime(task:TimeTask):Observable<TimeTask>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks_time_details/?subscription=${task.subscription}`;
    return this.httpClient.post<TimeTask>(serverUrl,task);
  }

  updateTaskTime(task:TimeTask){
    const serverUrl = `${this.config.serverUrl}/practice/tasks_time_details/${task.uuid}/?subscription=${task.subscription}`;
    return this.httpClient.put<TimeTask>(serverUrl,task);
  }

  saveTaskTime(task: TimeTask): Observable<TimeTask> {
    let saveOperation$: Observable<TimeTask>;
    const payload: TimeTask = { ...task };
    if (task.uuid != null && task.uuid !== '') {
      saveOperation$ = this.updateTaskTime(payload);
    } else {
      saveOperation$ = this.createTaskTime( payload);
    }
    return saveOperation$;
  }

  deleteTaskTime(subscription:string,uuid:string):Observable<TimeTask>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks_time_details/${uuid}?subscription=${subscription}`;
    return this.httpClient.delete<TimeTask>(serverUrl);
  }

  getTasksByCaseFile(subscription:string,uuid:string):Observable<Task[]>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/tasks/?subscription=${subscription}`;
    return this.httpClient.get<Task[]>(serverUrl).pipe(
      switchMap((tasks: Task[]) => {
            return of(tasks.sort((a, b) => {
              let dateA = new Date(a.created_at || '').getTime();
              let dateB = new Date(b.created_at || '').getTime();
              return dateB - dateA;
          }));
      })
    );
  }

  completeTask(task:Task):Observable<Task>{
    const serverUrl = `${this.config.serverUrl}/practice/tasks/${task.uuid}/change_status/?subscription=${task.subscription}`;
    return this.httpClient.put<Task>(serverUrl,task);
  }

  getDocumentTemplates(subscription:string):Observable<DocumentTemplate[]>{
    const serverUrl = `${this.config.serverUrl}/practice/document_templates/?subscription=${subscription}`;
    return this.httpClient.get<DocumentTemplate[]>(serverUrl).pipe(
      switchMap((documentTemplate: DocumentTemplate[]) => {
            return of(documentTemplate.sort((a, b) => {
              let dateA = new Date(a.created_at || '').getTime();
              let dateB = new Date(b.created_at || '').getTime();
              return dateB - dateA;
          }));
      })
    );
  }

  createDocumentTemplate(payload:DocumentTemplatePayload):Observable<DocumentTemplate>{
    const serverUrl = `${this.config.serverUrl}/practice/document_templates/?subscription=${payload.subscription}`;
    return this.httpClient.post<DocumentTemplate>(serverUrl,payload);
  }

  updateDocumentTemplate(payload:DocumentTemplatePayload):Observable<DocumentTemplate>{
    const serverUrl = `${this.config.serverUrl}/practice/document_templates/${payload.uuid}?subscription=${payload.subscription}`;
    return this.httpClient.put<DocumentTemplate>(serverUrl,payload);
  }

  saveDocumentTemplate(documentGeneration: DocumentTemplatePayload): Observable<DocumentTemplate> {
    let saveOperation$: Observable<DocumentTemplate>;
    const payload: DocumentTemplatePayload = { ...documentGeneration };
    if (documentGeneration.uuid != null && documentGeneration.uuid !== '') {
      saveOperation$ = this.updateDocumentTemplate(payload);
    } else {
      saveOperation$ = this.createDocumentTemplate( payload);
    }
    return saveOperation$.pipe(
      switchMap((item: DocumentTemplate) => {
        if (documentGeneration.file) {
          return this.uploadDocumentTemplate(payload.subscription || '',item.uuid || '', documentGeneration.file);
        }
        return of(item);
      })
    );
  }

  uploadDocumentTemplate(subscription: string, uuid: string, file: any) {
    const serverUrl: string = `${this.config.serverUrl}/practice/document_templates/${uuid}/upload_document/?subscription=${subscription}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subscription', subscription);
    return this.httpClient.put<any>(serverUrl, formData);
  }

  deleteDocumentTemplate(documentTemplate:DocumentTemplate):Observable<DocumentTemplate>{
    const serverUrl = `${this.config.serverUrl}/practice/document_templates/${documentTemplate.uuid}?subscription=${documentTemplate.subscription}`;
    return this.httpClient.delete<DocumentTemplate>(serverUrl);
  }

  downloadDocumentTemplate(documentTemplate:DocumentTemplate):Observable<any>{
    const serverUrl = `${this.config.serverUrl}/practice/document_templates/${documentTemplate.uuid}/download?subscription=${documentTemplate.subscription}`;
    return this.httpClient.get(serverUrl,{ responseType: 'blob' });
  }

  getDocumentGenerations(subscription:string):Observable<DocumentGeneration[]>{
    const serverUrl = `${this.config.serverUrl}/practice/document_generations/?subscription=${subscription}`;
    return this.httpClient.get<DocumentGeneration[]>(serverUrl).pipe(
      switchMap((documentGeneration: DocumentGeneration[]) => {
            return of(documentGeneration.sort((a, b) => {
              let dateA = new Date(a.created_at || '').getTime();
              let dateB = new Date(b.created_at || '').getTime();
              return dateB - dateA;
          }));
      })
    );
  }

  createDocumentGenerations(payload:DocumentGenerationPayload):Observable<DocumentGeneration>{
    const serverUrl = `${this.config.serverUrl}/practice/document_generations/?subscription=${payload.subscription}`;
    return this.httpClient.post<DocumentGeneration>(serverUrl,payload);
  }

  updateDocumentGenerations(payload:DocumentGenerationPayload):Observable<DocumentGeneration>{
    const serverUrl = `${this.config.serverUrl}/practice/document_generations/${payload.uuid}/?subscription=${payload.subscription}`;
    return this.httpClient.put<DocumentGeneration>(serverUrl,payload);
  }

  saveDocumentGeneration(documentGeneration: DocumentGenerationPayload): Observable<DocumentGeneration> {
    let saveOperation$: Observable<DocumentGeneration>;
    const payload: DocumentGenerationPayload = { ...documentGeneration };
    if (documentGeneration.uuid != null && documentGeneration.uuid !== '') {
      saveOperation$ = this.updateDocumentGenerations(payload);
    } else {
      saveOperation$ = this.createDocumentGenerations( payload);
    }
    return saveOperation$;
  }

  deleteDocumentGeneration(document:DocumentGeneration):Observable<DocumentGeneration[]>{
    const serverUrl = `${this.config.serverUrl}/practice/document_generations/${document.uuid}?subscription=${document.subscription}`;
    return this.httpClient.delete<DocumentGeneration[]>(serverUrl);
  }

  downloadDocumentGenerations(documentGeneration:DocumentGeneration):Observable<any>{
    const serverUrl = `${this.config.serverUrl}/practice/document_generations/${documentGeneration.uuid}/download?subscription=${documentGeneration.subscription}`;
    return this.httpClient.get(serverUrl,{ responseType: 'blob' });
  }

}
