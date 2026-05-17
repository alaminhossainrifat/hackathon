import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, UserDTO } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit {
  
  users: UserDTO[] = [];
  isLoading: boolean = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Fetch all registered users from the backend
  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data: UserDTO[]) => {
        this.users = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Update a specific user's role
  updateRole(userId: number, event: any) {
    const newRole = event.target.value;
    
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      this.adminService.updateUserRole(userId, newRole).subscribe({
        next: () => {
          alert(`✅ User role successfully updated to ${newRole}!`);
          this.loadUsers(); // Refresh the list to ensure data consistency
        },
        error: (err) => {
          console.error('Failed to update role:', err);
          alert('❌ Failed to update role. Please try again.');
          this.loadUsers(); // Revert the dropdown selection on failure
        }
      });
    } else {
      // Revert selection if user cancels
      this.loadUsers(); 
    }
  }
}