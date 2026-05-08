import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BloodBankService, BloodDonor } from '../../core/services/blood-bank';

@Component({
  selector: 'app-blood-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './blood-bank.html',
  styleUrl: './blood-bank.css'
})
export class BloodBankComponent implements OnInit {
  donors: BloodDonor[] = [];
  loading = false;
  showForm = false;
  error = '';

  searchGroup = 'A_POSITIVE';
  searchArea = '';

  newDonor: BloodDonor = {
    donorName: '', bloodGroup: 'A_POSITIVE', area: '', phone: ''
  };

  bloodGroups = [
    'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
    'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'
  ];

  constructor(
    private bloodBankService: BloodBankService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.search(); }

  search() {
    this.loading = true;
    const obs = this.searchArea.trim()
      ? this.bloodBankService.getByGroupAndArea(this.searchGroup, this.searchArea)
      : this.bloodBankService.getByBloodGroup(this.searchGroup);

    obs.subscribe({
      next: (data) => {
        this.donors = [...data];
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
    this.bloodBankService.create(this.newDonor).subscribe({
      next: () => { this.showForm = false; this.search(); this.resetForm(); },
      error: () => this.error = 'Failed to register'
    });
  }

  toggle(donor: BloodDonor) {
    this.bloodBankService.toggleAvailability(donor.id!).subscribe(() => this.search());
  }

  resetForm() {
    this.newDonor = { donorName: '', bloodGroup: 'A_POSITIVE', area: '', phone: '' };
  }

  formatGroup(group: string) {
    return group.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-');
  }
}