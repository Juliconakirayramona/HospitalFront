import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { Observable } from "rxjs";
import { Nurses } from "../nuser.component/nuser.component";

@Injectable({ providedIn: 'root' })
export class NurseServices {
    private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getNurses(): Observable<Nurses[]> {
    return this.http.get<Nurses[]>(`${this.baseUrl}/nurse/`);
  }

  createNuser(body: {speciality: string}): Observable<Nurses>{
    console.log('API URL:', this.baseUrl);
    return this.http.post<Nurses>(`${this.baseUrl}/nurse/`, body);
  }

  updateNuser(id_nurse: string, body: { speciality: string }): Observable<Nurses> {
      return this.http.put<Nurses>(`${this.baseUrl}/nurseupdate/${id_nurse}`, body);
    }
    
  deleteNurse(id_nurse: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/nursedelete/${id_nurse}`);
  }
}