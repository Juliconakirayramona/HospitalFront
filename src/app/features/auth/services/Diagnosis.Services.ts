import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Diagnosis } from "../diagnosis.component/diagnosis.component";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DiagnosisService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getDiagnosis(skip = 0, limit = 15): Observable<Diagnosis[]> {
        const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    return this.http.get<Diagnosis[]>(`${this.baseUrl}/diagnosis/all`, { params });
  }

  createDiagnosis(body: { diagnosis_description: string; diagnosis_date: string; }): Observable<Diagnosis> {
    return this.http.post<Diagnosis>(`${this.baseUrl}/diagnosis/`, body);
  }

  updateDiagnosis(id_diagnosis: string, body: { diagnosis_description: string }): Observable<Diagnosis> {
    return this.http.put<Diagnosis>(`${this.baseUrl}/diagnosis/update/${id_diagnosis}`, body);
  }

  deleteDiagnosis(id_diagnosis: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/diagnosis/delete/${id_diagnosis}`);
  }
}
