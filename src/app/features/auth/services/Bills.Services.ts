import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Bill } from "../bill.component/bill.component";

interface BillDto {
    id_patient: string,
    id_medical_appointment: string
    generation_hour: string
    generation_date: string
    total: number
}

@Injectable({ providedIn: 'root' })
export class BillService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getBills(skip = 0, limit = 15): Observable<Bill[]> {
        const params = new HttpParams()
            .set('skip', skip.toString())
            .set('limit', limit.toString());

        return this.http.get<Bill[]>(`${this.baseUrl}/bill/all`, { params });
    }

    createBill(body: BillDto): Observable<Bill> {
        return this.http.post<Bill>(`${this.baseUrl}/bill/`, body);
    }

    updateBill(id_bill: string, body: BillDto): Observable<Bill> {
        return this.http.put<Bill>(`${this.baseUrl}/bill/update/${id_bill}`, body);
    }
    deleteBill(id_bill: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/bill/delete/${id_bill}`);
    }

    getMedicalAppointmentById(id_bill: string): Observable<Bill> {
        return this.http.get<Bill>(`${this.baseUrl}/bill/${id_bill}`)
    }
}
