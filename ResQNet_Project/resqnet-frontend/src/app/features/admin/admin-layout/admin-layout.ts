import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive], 
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {
  
  // Show alert for mock features during hackathon demo
  showMockAlert(feature: string) {
    alert(`🚧 ${feature} Management panel is a mock UI for the hackathon demo. Full CRUD operations are coming soon!`);
  }
}