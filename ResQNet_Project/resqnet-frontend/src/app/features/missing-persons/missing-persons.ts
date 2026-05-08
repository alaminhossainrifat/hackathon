import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MissingPersonService, MissingPerson } from '../../core/services/missing-person';

@Component({
  selector: 'app-missing-persons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './missing-persons.html',
  styleUrl: './missing-persons.css'
})
export class MissingPersonsComponent implements OnInit {
  persons: MissingPerson[] = [];
  loading = false;
  showForm = false;
  error = '';
  searchQuery = '';
  searchType = 'name';

  newPerson: MissingPerson = {
    name: '',
    age: 0,
    gender: 'MALE',
    lastSeenLocation: '',
    description: '',
    reporterName: '',
    reporterPhone: ''
  };

  genders = ['MALE', 'FEMALE', 'OTHER'];

  constructor(
    private missingPersonService: MissingPersonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.missingPersonService.getAll().subscribe({
      next: (data) => {
        this.persons = [...data];
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
    if (!this.searchQuery.trim()) {
      this.load();
      return;
    }

    this.loading = true;

    const obs =
      this.searchType === 'name'
        ? this.missingPersonService.searchByName(this.searchQuery)
        : this.missingPersonService.searchByLocation(this.searchQuery);

    obs.subscribe({
      next: (data) => {
        this.persons = [...data];
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
    this.missingPersonService.create(this.newPerson).subscribe({
      next: () => {
        this.showForm = false;
        this.load();
        this.resetForm();
      },
      error: () => {
        this.error = 'Failed to report';
      }
    });
  }

  markFound(person: MissingPerson) {
    this.missingPersonService
      .markFound(person.id!)
      .subscribe(() => this.load());
  }

  resetForm() {
    this.newPerson = {
      name: '',
      age: 0,
      gender: 'MALE',
      lastSeenLocation: '',
      description: '',
      reporterName: '',
      reporterPhone: ''
    };
  }
}