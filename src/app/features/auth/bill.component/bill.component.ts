import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BillService } from '../services/Bills.Services';


export interface Bill {
  id_bill: string,
  generation_date: string,
  generation_hour: string,
  total: number,
  id_patient: string,
  id_medical_appointment: string
}

@Component({
  selector: 'app-bill.component',
  imports: [FormsModule, CommonModule],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.scss',
})
export class BillComponent {
  bills: Bill[] = [];
  loading = false;
  errorMsg = '';
  pageSize = 10;
  currentPage = 1;
  hasMore = true;

  selectedPatientId = '';
  selectedMedicalAppointmentId = '';
  selectedGenerationHour = '';
  selectedGenerationDate = '';
  selectedTotal = 0;
  selectedBillId = '';

  constructor(private billService: BillService) { }

  ngOnInit(): void {
    this.loadBills();
  }

  createNewBill() {
    // Validación básica
    if (!this.selectedPatientId || !this.selectedMedicalAppointmentId || !this.selectedGenerationHour || !this.selectedGenerationDate || this.selectedTotal <= 0) {
      this.errorMsg = 'Debes seleccionar el paciente, la cita, la hora de generacion, el dia de generacion y el total';
      return;
    }

    const body = {
      id_patient: this.selectedPatientId,
      id_medical_appointment: this.selectedMedicalAppointmentId,
      generation_hour: this.selectedGenerationHour,
      generation_date: this.selectedGenerationDate,
      total: Number(this.selectedTotal),
    };
    console.log(body)
    this.loading = true;
    this.errorMsg = '';

    this.billService.createBill(body).subscribe({
      next: (res) => {
        console.log('Factura creada:', res);
        this.loading = false;

        // limpiar “formulario” (si aplica)
        this.selectedPatientId = '';
        this.selectedMedicalAppointmentId = '';
        this.selectedGenerationHour = '';
        this.selectedGenerationDate = '';
        this.selectedTotal = 0;
        this.selectedBillId = '';
        this.errorMsg = '';

        // recargar tabla
        this.loadBills(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo crear la factura';
        this.loading = false;
      }
    });
  }
  updateBill(b: Bill) {
    if (!b.id_medical_appointment) {
      this.errorMsg = 'La factura no tiene un ID válido.';
      return;
    }

    const body = {
      id_patient: b.id_patient,
      id_medical_appointment: b.id_medical_appointment,
      generation_hour: b.generation_hour,
      generation_date: b.generation_date,
      total: Number(b.total),
    };

    this.loading = true;
    this.errorMsg = '';

    this.billService.updateBill(b.id_bill.toString(), body).subscribe({
      next: (res) => {
        console.log('factura actualizada:', res);
        this.loading = false;
        // recargar lista o actualizar solo esa fila
        this.loadBills(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo actualizar la factura';
        this.loading = false;
      }
    });
  }

  loadBills(page: number = 1) {
    const skip = (page - 1) * this.pageSize;
    const limit = this.pageSize;
    this.currentPage = page
    this.loading = true;
    this.errorMsg = '';

    this.billService.getBills(skip, limit).subscribe({
      next: (data: Bill[]) => {
        this.bills = data || [];
        this.hasMore = this.bills.length === this.pageSize;

        console.log('Bills loaded', data);
        console.log('Bills loaded', this.bills);
        console.log('length =>', this.bills.length);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudieron cargar las facturas';
        this.loading = false;
        this.bills = [];
      },
    });
  }

  onDeleteBill(b: Bill) {
    if (!b.id_bill) {
      this.errorMsg = 'La factura no tiene un ID válido.';
      return;
    }

    const confirmed = confirm('¿Seguro que deseas eliminar esta factura?');
    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.billService.deleteBill(b.id_bill.toString()).subscribe({
      next: (res) => {
        console.log('Factura eliminada:', res);
        this.loading = false;
        // recargar lista
        this.loadBills(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err?.error?.detail || 'No se pudo eliminar la factura';
        this.loading = false;
      }
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadBills(this.currentPage - 1);
    }
  }


  nextPage() {
    if (this.hasMore) {
      this.loadBills(this.currentPage + 1);
    }
  }
}

