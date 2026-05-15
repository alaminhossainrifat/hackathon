import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserProfile, ProfileService } from '../core/services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  isEditing: boolean = false;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  saveMessage: string = '';
  errorMessage: string = '';

  profile: UserProfile = {
    name: '',
    phone: '',
    bloodGroup: 'Unknown',
    medicalConditions: '',
    emergencyContact1: '',
    emergencyContact2: '',
    isVolunteer: false
  };

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef // Added ChangeDetectorRef to force UI updates
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.fetchProfile();
  }

  // Helper method to extract username/email from the JWT token
  extractNameFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.username || payload.email || 'User';
      } catch (e) {
        return 'User';
      }
    }
    return 'Guest User';
  }

  fetchProfile() {
    this.isLoading = true;
    this.cdr.detectChanges(); // Update UI to show loading

    this.profileService.getProfile().subscribe({
      next: (data) => {
        if (data) {
          this.profile = data;
        }
        
        if (this.isLoggedIn && !this.profile.name) {
          this.profile.name = this.extractNameFromToken();
        }

        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update after data loads
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        
        if (this.isLoggedIn && !this.profile.name) {
          this.profile.name = this.extractNameFromToken();
        }
        
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update even on error
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.saveMessage = '';
    this.cdr.detectChanges();
  }

  saveProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges(); // Update UI to show loading spinner

    this.profileService.updateProfile(this.profile).subscribe({
      next: (updatedData) => {
        this.profile = updatedData;
        this.isEditing = false;
        this.isLoading = false;
        this.saveMessage = 'Profile updated successfully!';
        
        this.cdr.detectChanges(); // Force UI update to show success message and hide spinner
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.saveMessage = '';
          this.cdr.detectChanges(); // Force UI update again
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.errorMessage = 'Failed to save changes. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update to show error
      }
    });
  }
}