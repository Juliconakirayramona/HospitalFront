import { Component } from '@angular/core';
import { NurseServices } from '../services/Nurse.Services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterDiagnosisPipe } from "../../../shared/pipes/capitalize-pipe";

export interface Nurses {
  id_nurse: string;          
  speciality: string;
  id_user_information: string;
}

@Component({
  selector: 'app-nuser.component',
  imports: [FormsModule, CommonModule, FilterDiagnosisPipe],
  templateUrl: './nuser.component.html',
  styleUrl: './nuser.component.scss',
})
export class NuserComponent {
  nurses: Nurses[] = [];
  loading = false;
  errorMsg = '';
  pageSize = 0;        
  currentPage = 1;      
  hasMore = true;       
  searchText: string = '';
  selectedUserInfoId = '';   
  selectedSpeciality = ''; 

   constructor (private nurseService: NurseServices) {}
     ngOnInit(): void {
      this.loadNurses();
    }
  
    createNewPatient() {
    // Validación básica
    if (!this.selectedSpeciality || !this.selectedUserInfoId) {
      this.errorMsg = 'Debes seleccionar el usuario y el tipo de sangre.';
      return;
    }
    const body = {
      id_user_information: this.selectedUserInfoId,
      speciality: this.selectedSpeciality
    };
    this.loading = true;
    this.errorMsg = '';
    this.nurseService.createNuser(body).subscribe({
      next: (res) => {
        console.log('Paciente creado:', res);
        this.loading = false;
        // limpiar “formulario” (si aplica)
        this.selectedUserInfoId = '';
        this.selectedSpeciality = '';
        this.errorMsg = '';
        // recargar tabla
        this.loadNurses(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo crear la enfermera';
        this.loading = false;
      }
    });
  }
  updateNurse(n: Nurses) {
    if (!n.id_nurse) {
      this.errorMsg = 'la enfermera no tiene un ID válido.';
      return;
    }
  
    const body = {
      speciality: n.speciality,
      id_user_information: n.id_user_information  
    };
  
    this.loading = true;
    this.errorMsg = '';
    console.log('Body que se envía al backend:', body);
    this.nurseService.updateNuser(n.id_nurse.toString(), body).subscribe({
      next: (res) => {
        console.log('Enfermera actualizada:', res);
        this.loading = false;
        // recargar lista o actualizar solo esa fila
        this.loadNurses(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo actualizar la enfermera';
        this.loading = false;
      }
    });
  }
  onDeleteNurse(n: Nurses) {
      if (!n.id_nurse) {
        this.errorMsg = 'La enfermera no tiene un ID válido.';
        return;
      }
  
      const confirmed = confirm('¿Seguro que deseas eliminar esta enfermera?');
      if (!confirmed) {
        return;
      }
  
      this.loading = true;
      this.errorMsg = '';
  
      this.nurseService.deleteNurse(n.id_nurse.toString()).subscribe({
        next: (res) => {
          console.log('Enfermera eliminada:', res);
          this.loading = false;
          // recargar lista
          this.loadNurses(this.currentPage);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err?.error?.detail || 'No se pudo eliminar la enfermera';
          this.loading = false;
        }
      });
    }

  loadNurses( page: number = 1) {
      const skip = (page - 1) * this.pageSize;
      const limit = this.pageSize;
      this.currentPage = page
      this.loading = true;
      this.errorMsg = '';
  
      this.nurseService.getNurses().subscribe({
        next: (data: Nurses[]) => {
            this.nurses = data || [];
          this.hasMore = this.nurses.length === this.pageSize;
  
          console.log('Patients loaded', data);
          console.log('Patients loaded', this.nurses);
          console.log('length =>', this.nurses.length);
  
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No se pudieron cargar las enfermeras';
          this.loading = false;
           this.nurses = []; 
        },
      });
    }
      prevPage() {
    if (this.currentPage > 1) {
      this.loadNurses(this.currentPage - 1);
    }
  }


  nextPage() {
    if (this.hasMore) {
      this.loadNurses(this.currentPage + 1);
    }
  }
}
