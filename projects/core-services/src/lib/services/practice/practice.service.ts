import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CaseFile, CaseFileDocument, CaseFileNote, CaseFileWalletDetail,CaseFilePayload, CaseFileDocumentPayload } from 'core-models';
import { Observable, of, switchMap } from 'rxjs';

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

  // createCaseFileDocument(subscription:string,uuid:string):Observable<CaseFileDocument[]>{
  //   const serverUrl = `${this.config.serverUrl}/practice/case_files/${uuid}/documents/?subscription=${subscription}`;
  //   return this.httpClient.delete<CaseFileDocument[]>(serverUrl);
  // }

  createCaseFileDocument(createCaseFileDocument: CaseFileDocumentPayload) {
    const serverUrl = `${this.config.serverUrl}/practice/case_files/${createCaseFileDocument.case_file}/documents/?subscription=${createCaseFileDocument.subscription}`;
    const formData = new FormData();
    formData.append('file', createCaseFileDocument.document || '');
    formData.append('case_file', createCaseFileDocument.case_file);
    formData.append('subscription', createCaseFileDocument.subscription);
    console.log('Form Data',formData);
    return this.httpClient.post<any>(serverUrl, formData);
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
    return this.httpClient.delete<CaseFileWalletDetail[]>(serverUrl);
  }


}
