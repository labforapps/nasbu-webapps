import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DocumentTemplateTypeTest, Feature, Plan } from 'core-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(@Inject('config') private config: any,
              private httpClient: HttpClient) { }

  getFeatures(): Observable<Feature[]> {
      const serverUrl: string = `${this.config.serverUrl}/core/features/`;
      return this.httpClient.get<Feature[]>(serverUrl);
  }

  getPlans(): Observable<Plan[]> {
      const serverUrl: string = `${this.config.serverUrl}/core/plans/`;
      return this.httpClient.get<Plan[]>(serverUrl);
  }

  getDocumentTemplateTypes(): Observable<DocumentTemplateTypeTest[]> {
      const serverUrl: string = `${this.config.serverUrl}/core/document_templates_types/`;
      return this.httpClient.get<DocumentTemplateTypeTest[]>(serverUrl);
  }


}
