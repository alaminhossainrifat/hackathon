import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DoctorService, Doctor } from '../../core/services/doctor';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = false;
  showForm = false;
  error = '';
  searchArea = '';

  newDoctor: Doctor = {
    name: '', specialization: '', area: '',
    phone: '', hospital: '', consultType: 'BOTH'
  };

  consultTypes = ['IN_PERSON', 'ONLINE', 'BOTH'];

  constructor(
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.doctorService.getAll().subscribe({
      next: (data) => {
        this.doctors = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  search() {
    if (!this.searchArea.trim()) { this.load(); return; }
    this.loading = true;
    this.doctorService.getByArea(this.searchArea).subscribe({
      next: (data) => {
        this.doctors = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Search failed';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  create() {
    this.doctorService.create(this.newDoctor).subscribe({
      next: () => { this.showForm = false; this.load(); this.resetForm(); },
      error: () => this.error = 'Failed to create'
    });
  }

  toggle(doctor: Doctor) {
    this.doctorService.toggleAvailability(doctor.id!).subscribe(() => this.load());
  }

  resetForm() {
    this.newDoctor = { name: '', specialization: '', area: '', phone: '', hospital: '', consultType: 'BOTH' };
  }
}