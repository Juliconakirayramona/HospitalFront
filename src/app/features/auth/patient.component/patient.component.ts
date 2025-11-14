import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/Patients.Services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


export interface Patient {
  id_patient: number;          
  blood_type: string;
  id_user_information: string;

  
}
@Component({
  selector: 'app-patient.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
})
export class PatientComponent implements OnInit  {
  patients: Patient[] = [];
  loading = false;
  errorMsg = '';
  pageSize = 10;        
  currentPage = 1;      
  hasMore = true;       

  selectedUserInfoId = '';   
  selectedBloodType = ''; 
  constructor (private patientService: PatientService) {}
   ngOnInit(): void {
    this.loadPatients();
  }

    createNewPatient() {
    // Validación básica
    if (!this.selectedUserInfoId || !this.selectedBloodType) {
      this.errorMsg = 'Debes seleccionar el usuario y el tipo de sangre.';
      return;
    }

    const body = {
      id_user_information: this.selectedUserInfoId,
      blood_type: this.selectedBloodType
    };

    this.loading = true;
    this.errorMsg = '';

    this.patientService.createPatient(body).subscribe({
      next: (res) => {
        console.log('Paciente creado:', res);
        this.loading = false;

        // limpiar “formulario” (si aplica)
        this.selectedUserInfoId = '';
        this.selectedBloodType = '';
        this.errorMsg = '';

        // recargar tabla
        this.loadPatients(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo crear el paciente';
        this.loading = false;
      }
    });
  }
  updatePatient(p: Patient) {
  if (!p.id_patient) {
    this.errorMsg = 'El paciente no tiene un ID válido.';
    return;
  }

  const body = {
    blood_type: p.blood_type   // lo que esté actualmente en la fila
  };

  this.loading = true;
  this.errorMsg = '';

  this.patientService.updatePatient(p.id_patient.toString(), body).subscribe({
    next: (res) => {
      console.log('Paciente actualizado:', res);
      this.loading = false;
      // recargar lista o actualizar solo esa fila
      this.loadPatients(this.currentPage);
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = err?.error?.detail || 'No se pudo actualizar el paciente';
      this.loading = false;
    }
  });
}

    loadPatients( page: number = 1) {
    const skip = (page - 1) * this.pageSize;
    const limit = this.pageSize;
    this.currentPage = page
    this.loading = true;
    this.errorMsg = '';

    this.patientService.getPatients(skip, limit).subscribe({
      next: (data: Patient[]) => {
          this.patients = data || [];
        this.hasMore = this.patients.length === this.pageSize;

        console.log('Patients loaded', data);
        console.log('Patients loaded', this.patients);
        console.log('length =>', this.patients.length);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudieron cargar los pacientes';
        this.loading = false;
         this.patients = []; 
      },
    });
  }
  
   onDeletePatient(p: Patient) {
    if (!p.id_patient) {
      this.errorMsg = 'El paciente no tiene un ID válido.';
      return;
    }

    const confirmed = confirm('¿Seguro que deseas eliminar este paciente?');
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.patientService.deletePatient(p.id_patient.toString()).subscribe({
      next: (res) => {
        console.log('Paciente eliminado:', res);
        this.loading = false;
        // recargar lista
        this.loadPatients(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo eliminar el paciente';
        this.loading = false;
      }
    });
  }
   prevPage() {
    if (this.currentPage > 1) {
      this.loadPatients(this.currentPage - 1);
    }
  }


  nextPage() {
    if (this.hasMore) {
      this.loadPatients(this.currentPage + 1);
    }
  }
}
