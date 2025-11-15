import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicalAppointmentService } from '../services/MedicalAppointment.Services';


export interface MedicalAppointment {
  id_medical_appointment: string
  id_medic: string;
  id_nurse: string;
  id_patient: string;
  id_diagnosis: string;
  location: string;
  appointment_hour: string;
  appointment_date: string;
}
@Component({
  selector: 'app-medical-appointment.component',
  imports: [FormsModule, CommonModule],
  templateUrl: './medical-appointment.component.html',
  styleUrl: './medical-appointment.component.scss',
})
export class MedicalAppointmentComponent {
  medicalAppointments: MedicalAppointment[] = [];
  loading = false;
  errorMsg = '';
  pageSize = 10;
  currentPage = 1;
  hasMore = true;

  selectedMedicId = '';
  selectedNurseId = '';
  selectedPatientId = '';
  selectedDiagnosisId = '';
  selectedLocation = '';
  selectedAppointmentHour = '';
  selectedAppointmentDate = '';
  selectedAppointmentId = '';

  constructor(private medicalAppointmentService: MedicalAppointmentService) { }

  ngOnInit(): void {
    this.loadMedicalAppointments();
  }

  createNewMedicalAppointment() {
    // Validación básica
    if (!this.selectedMedicId || !this.selectedNurseId || !this.selectedPatientId || !this.selectedDiagnosisId || !this.selectedAppointmentHour || !this.selectedAppointmentDate || !this.selectedLocation) {
      this.errorMsg = 'Debes seleccionar el medico, la enfermera, el paciente, la locacion, el diagnostico, la hora y el dia de la cita.';
      return;
    }

    const body = {
      appointment_date: this.selectedAppointmentDate,
      appointment_hour: this.selectedAppointmentHour,
      location: this.selectedLocation,
      id_medic: this.selectedMedicId,
      id_nurse: this.selectedNurseId,
      id_patient: this.selectedPatientId,
      id_diagnosis: this.selectedDiagnosisId,
    };

    this.loading = true;
    this.errorMsg = '';

    this.medicalAppointmentService.createMedicalAppointment(body).subscribe({
      next: (res) => {
        console.log('Medico creado:', res);
        this.loading = false;

        // limpiar “formulario” (si aplica)
        this.selectedMedicId = '';
        this.selectedNurseId = '';
        this.selectedPatientId = '';
        this.selectedDiagnosisId = '';
        this.selectedAppointmentHour = '';
        this.selectedAppointmentDate = '';
        this.selectedLocation = '';
        this.errorMsg = '';

        // recargar tabla
        this.loadMedicalAppointments(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo crear la cita';
        this.loading = false;
      }
    });
  }
  updateMedicalAppointment(m: MedicalAppointment) {
    if (!m.id_medical_appointment) {
      this.errorMsg = 'La cita no tiene un ID válido.';
      return;
    }

    const body = {
      appointment_date: m.appointment_date,
      appointment_hour: m.appointment_hour,
      location: m.location,
      id_medic: m.id_medic,
      id_nurse: m.id_nurse,
      id_patient: m.id_patient,
      id_diagnosis: m.id_diagnosis,
    };

    this.loading = true;
    this.errorMsg = '';

    this.medicalAppointmentService.updateMedicalAppointment(m.id_medical_appointment.toString(), body).subscribe({
      next: (res) => {
        console.log('Cita actualizada:', res);
        this.loading = false;
        // recargar lista o actualizar solo esa fila
        this.loadMedicalAppointments(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo actualizar la cita';
        this.loading = false;
      }
    });
  }

  loadMedicalAppointments(page: number = 1) {
    const skip = (page - 1) * this.pageSize;
    const limit = this.pageSize;
    this.currentPage = page
    this.loading = true;
    this.errorMsg = '';

    this.medicalAppointmentService.getMedicalAppointments(skip, limit).subscribe({
      next: (data: MedicalAppointment[]) => {
        this.medicalAppointments = data || [];
        this.hasMore = this.medicalAppointments.length === this.pageSize;

        console.log('MedicalAppointments loaded', data);
        console.log('MedicalAppointments loaded', this.medicalAppointments);
        console.log('length =>', this.medicalAppointments.length);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudieron cargar las citas';
        this.loading = false;
        this.medicalAppointments = [];
      },
    });
  }

  onDeleteMedicalAppointment(m: MedicalAppointment) {
    if (!m.id_medical_appointment) {
      this.errorMsg = 'La cita no tiene un ID válido.';
      return;
    }

    const confirmed = confirm('¿Seguro que deseas eliminar esta cita?');
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.medicalAppointmentService.deleteMedicalAppointment(m.id_medical_appointment.toString()).subscribe({
      next: (res) => {
        console.log('Cita eliminada:', res);
        this.loading = false;
        // recargar lista
        this.loadMedicalAppointments(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo eliminar la cita';
        this.loading = false;
      }
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadMedicalAppointments(this.currentPage - 1);
    }
  }


  nextPage() {
    if (this.hasMore) {
      this.loadMedicalAppointments(this.currentPage + 1);
    }
  }
}
