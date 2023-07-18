import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CaseFile, CaseFileDocument, CaseFileNote, CaseFileWalletDetail,CaseFilePayload, CaseFileDocumentPayload, CaseFileAccess } from 'core-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {

  constructor(@Inject('config') private config: any,
  private httpClient: HttpClient) { }

  getCaseFiles(subscription:string):Observable<CaseFile[]>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/?subscription=${subscription}`;
    return this.httpClient.get<CaseFile[]>(serverUrl);
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
      saveOperation$ = this.createCaseFile(caseFilePayload.subscription || '', payload);
    }
    return saveOperation$;
  }

  updateCaseFile(subscription:string,caseFilePayload:CaseFilePayload,uuid:string):Observable<CaseFile>{
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/?subscription=${subscription}`;
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

}
