import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Patient } from "../patient.component/patient.component";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getPatients(skip = 0, limit = 15): Observable<Patient[]> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    return this.http.get<Patient[]>(`${this.baseUrl}/patient/all`, { params });
  }

  createPatient(body: { id_user_information: string; blood_type: string; }): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/patient/`, body);
  }

  updatePatient(id_patient: string, body: { blood_type: string }): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/patient/update/${id_patient}`, body);
  }

  deletePatient(id_patient: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/patient/delete/${id_patient}`);
  }
}
