import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Medic } from "../medic.component/medic.component";

@Injectable({ providedIn: 'root' })
export class MedicService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getMedics(skip = 0, limit = 15): Observable<Medic[]> {
        const params = new HttpParams()
            .set('skip', skip.toString())
            .set('limit', limit.toString());

        return this.http.get<Medic[]>(`${this.baseUrl}/medics/`, { params });
    }


    createMedic(body: { id_user_information: string; specialty: string; }): Observable<Medic> {
        return this.http.post<Medic>(`${this.baseUrl}/medics/`, body);
    }

    updateMedic(id_medic: string, body: { specialty: string }): Observable<Medic> {
        return this.http.put<Medic>(`${this.baseUrl}/medics/update/${id_medic}`, body);
    }

    deleteMedic(id_medic: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/medics/delete/${id_medic}`);
    }
}
