import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpParams, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MedicalAppointment } from "../medical-appointment.component/medical-appointment.component";

interface MedicalAppointmentDto {
    appointment_date: string,
    appointment_hour: string,
    location: string,
    id_medic: string,
    id_nurse: string,
    id_patient: string,
    id_diagnosis: string,
}


@Injectable({ providedIn: 'root' })
export class MedicalAppointmentService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getMedicalAppointments(skip = 0, limit = 15): Observable<MedicalAppointment[]> {
        const params = new HttpParams()
            .set('skip', skip.toString())
            .set('limit', limit.toString());

        return this.http.get<MedicalAppointment[]>(`${this.baseUrl}/medical_appointment/all/`);
        // return this.http.get<MedicalAppointment[]>(`${this.baseUrl}/medical_appointment`);
    }

    createMedicalAppointment(body: MedicalAppointmentDto): Observable<MedicalAppointment> {
        return this.http.post<MedicalAppointment>(`${this.baseUrl}/medical_appointment/`, body);
    }

    updateMedicalAppointment(id_medical_appointment: string, body: MedicalAppointmentDto): Observable<MedicalAppointment> {
        return this.http.put<MedicalAppointment>(`${this.baseUrl}/medical_appointment/${id_medical_appointment}`, body);
    }
    deleteMedicalAppointment(id_medical_appointment: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/medical_appointment/${id_medical_appointment}`);
    }

    getMedicalAppointmentById(id_medical_appointment: string): Observable<MedicalAppointment> {
        return this.http.get<MedicalAppointment>(`${this.baseUrl}/medical_appointment/${id_medical_appointment}`)
    }
}
