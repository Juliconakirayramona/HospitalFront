import { Component } from '@angular/core';
import { DiagnosisService } from '../services/Diagnosis.Services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterDiagnosisPipe } from "../../../shared/pipes/capitalize-pipe";

export interface Diagnosis {
  id_diagnosis: string;
  diagnosis_date: string;
  diagnosis_description: string;
}

@Component({
  selector: 'app-diagnosis.component',
  imports: [FormsModule, CommonModule, FilterDiagnosisPipe],
  templateUrl: './diagnosis.component.html',
  styleUrl: './diagnosis.component.scss',
})
export class DiagnosisComponent {
    diagnosis: Diagnosis[] = [];
    loading = false;
    errorMsg = '';
    pageSize = 12312;        
    currentPage = 1;      
    hasMore = true;       
     searchText: string = '';
    selecteddiagnosis_description = '';   
    selecteddiagnosis_date = ''; 

     constructor (private diagnosisService: DiagnosisService) {}
       ngOnInit(): void {
        this.loadDiagonosis();
      }
      createNewDiagnosis() {
    // Validación básica
    if (!this.selecteddiagnosis_description || !this.selecteddiagnosis_date) {
      this.errorMsg = 'Debes seleccionar el usuario y el tipo de sangre.';
      return;
    }
    const body = {
      diagnosis_description: this.selecteddiagnosis_description,
      diagnosis_date: this.selecteddiagnosis_date
    };
    this.loading = true;
    this.errorMsg = '';
    this.diagnosisService.createDiagnosis(body).subscribe({
      next: (res) => {
        console.log('Paciente creado:', res);
        this.loading = false;
        // limpiar “formulario” (si aplica)
        this.selecteddiagnosis_description = '';
        this.selecteddiagnosis_date = '';
        this.errorMsg = '';
        // recargar tabla
        this.loadDiagonosis(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo crear el diagnóstico';
        this.loading = false;
      }
    });
  }
  updateDiagnosis(d: Diagnosis) {
    if (!d.id_diagnosis) {
      this.errorMsg = 'El diagnóstico no tiene un ID válido.';
      return;
    }
  
    const body = {
      diagnosis_description: d.diagnosis_description,
    };
  
    this.loading = true;
    this.errorMsg = '';
  
    this.diagnosisService.updateDiagnosis(d.id_diagnosis.toString(), body).subscribe({
      next: (res) => {
        console.log('Diagnóstico actualizado:', res);
        this.loading = false;
        // recargar lista o actualizar solo esa fila
        this.loadDiagonosis(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo actualizar el paciente';
        this.loading = false;
      }
    });
  }
  onDeleteDiagnosis(d: Diagnosis) {
      if (!d.id_diagnosis) {
        this.errorMsg = 'El diagnóstico no tiene un ID válido.';
        return;
      }
  
      const confirmed = confirm('¿Seguro que deseas eliminar este diagnóstico?');
      if (!confirmed) {
        return;
      }
  
      this.loading = true;
      this.errorMsg = '';
  
      this.diagnosisService.deleteDiagnosis(d.id_diagnosis.toString()).subscribe({
        next: (res) => {
          console.log('Diagnóstico eliminado:', res);
          this.loading = false;
          // recargar lista
          this.loadDiagonosis(this.currentPage);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err?.error?.detail || 'No se pudo eliminar el diagnóstico';
          this.loading = false;
        }
      });
    }
  loadDiagonosis( page: number = 1) {
      const skip = (page - 1) * this.pageSize;
      const limit = this.pageSize;
      this.currentPage = page
      this.loading = true;
      this.errorMsg = '';
  
      this.diagnosisService.getDiagnosis(skip, limit).subscribe({
        next: (data: Diagnosis[]) => {
            this.diagnosis = data || [];
          this.hasMore = this.diagnosis.length === this.pageSize;
  
          console.log('Diagnosis loaded', data);
          console.log('Diagnosis loaded', this.diagnosis);
          console.log('length =>', this.diagnosis.length);
  
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No se pudieron cargar los diagnósticos';
          this.loading = false;
           this.diagnosis = []; 
        },
      });
    }
     prevPage() {
    if (this.currentPage > 1) {
      this.loadDiagonosis(this.currentPage - 1);
    }
  }


  nextPage() {
    if (this.hasMore) {
      this.loadDiagonosis(this.currentPage + 1);
    }
  }
}
