import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MedicService } from '../services/Medics.services';
import { FormsModule } from '@angular/forms';
import { FilterDiagnosisPipe } from "../../../shared/pipes/capitalize-pipe";

export interface Medic {
  id_medic: string;
  specialty: string;
  id_user_information: string;
}
@Component({
  selector: 'app-medic.component',
  imports: [FormsModule, CommonModule, FilterDiagnosisPipe],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.scss',
})

export class MedicComponent {
  medics: Medic[] = [];
  loading = false;
  errorMsg = '';
  pageSize = 10;
  currentPage = 1;
  hasMore = true;
  searchText: string = '';
  selectedUserInfoId = '';
  selectedSpecialty = '';

  constructor(private medicService: MedicService) { }

  ngOnInit(): void {
    this.loadMedics();
  }

  createNewMedic() {
    // Validación básica
    if (!this.selectedUserInfoId || !this.selectedSpecialty) {
      this.errorMsg = 'Debes seleccionar el usuario y la especialidad del medico.';
      return;
    }

    const body = {
      id_user_information: this.selectedUserInfoId,
      specialty: this.selectedSpecialty
    };

    this.loading = true;
    this.errorMsg = '';

    this.medicService.createMedic(body).subscribe({
      next: (res) => {
        console.log('Medico creado:', res);
        this.loading = false;

        // limpiar “formulario” (si aplica)
        this.selectedUserInfoId = '';
        this.selectedSpecialty = '';
        this.errorMsg = '';

        // recargar tabla
        this.loadMedics(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo crear el medico';
        this.loading = false;
      }
    });
  }
  updateMedic(m: Medic) {
    if (!m.id_medic) {
      this.errorMsg = 'El Medico no tiene un ID válido.';
      return;
    }

    const body = {
      specialty: m.specialty   // lo que esté actualmente en la fila
    };

    this.loading = true;
    this.errorMsg = '';

    this.medicService.updateMedic(m.id_medic.toString(), body).subscribe({
      next: (res) => {
        console.log('Medico actualizado:', res);
        this.loading = false;
        // recargar lista o actualizar solo esa fila
        this.loadMedics(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo actualizar el medico';
        this.loading = false;
      }
    });
  }

  loadMedics(page: number = 1) {
    const skip = (page - 1) * this.pageSize;
    const limit = this.pageSize;
    this.currentPage = page
    this.loading = true;
    this.errorMsg = '';

    this.medicService.getMedics(skip, limit).subscribe({
      next: (data: Medic[]) => {
        this.medics = data || [];
        this.hasMore = this.medics.length === this.pageSize;

        console.log('Medics loaded', data);
        console.log('Medics loaded', this.medics);
        console.log('length =>', this.medics.length);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudieron cargar los medicos';
        this.loading = false;
        this.medics = [];
      },
    });
  }

  onDeleteMedic(m: Medic) {
    if (!m.id_medic) {
      this.errorMsg = 'El medico no tiene un ID válido.';
      return;
    }

    const confirmed = confirm('¿Seguro que deseas eliminar este medico?');
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.medicService.deleteMedic(m.id_medic.toString()).subscribe({
      next: (res) => {
        console.log('medico eliminado:', res);
        this.loading = false;
        // recargar lista
        this.loadMedics(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo eliminar el medico';
        this.loading = false;
      }
    });
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.loadMedics(this.currentPage - 1);
    }
  }


  nextPage() {
    if (this.hasMore) {
      this.loadMedics(this.currentPage + 1);
    }
  }
}
