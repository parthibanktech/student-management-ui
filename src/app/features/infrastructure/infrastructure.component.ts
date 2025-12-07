import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfrastructureService, Classroom } from '../../services/infrastructure.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-infrastructure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-semibold text-[#161616]">Infrastructure</h2>
          <p class="text-sm text-[#525252] mt-1">Manage classrooms and facilities</p>
        </div>
        <button (click)="showForm = !showForm" class="bx--btn-primary">
          {{ showForm ? 'Cancel' : '+ Add Classroom' }}
        </button>
      </div>

            <!-- Add Form -->
      <div *ngIf="showForm" class="bg-white p-6 border border-[#e0e0e0] mb-8 shadow-sm">
        <h3 class="text-lg font-medium mb-4">Add New Classroom</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input [(ngModel)]="newRoom.roomNumber" placeholder="Room Number (e.g. A-101)" class="bx--text-input">
          <input [(ngModel)]="newRoom.buildingName" placeholder="Building Name" class="bx--text-input">
          <input [(ngModel)]="newRoom.capacity" type="number" placeholder="Capacity" class="bx--text-input">
          <select [(ngModel)]="newRoom.roomType" class="bx--text-input">
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Lab">Lab</option>
            <option value="Conference Room">Conference Room</option>
          </select>
        </div>
        <div class="mt-4 flex justify-end">
          <button (click)="addClassroom()" class="bg-[#0f62fe] text-white px-4 py-2 hover:bg-[#0353e9]">Save Room</button>
        </div>
      </div>

      <!-- Infrastructure Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let room of infraService.classrooms()" class="bg-white border-l-4 border-[#0f62fe] p-5 shadow-sm hover:shadow-md transition-shadow">
           <div class="flex justify-between items-start">
             <h4 class="font-bold text-[#161616] text-lg">{{ room.roomNumber }}</h4>
             <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{{ room.roomType }}</span>
           </div>
           <p class="text-sm text-[#525252] mt-2">{{ room.buildingName }}</p>
           <p class="text-xs text-[#525252] mt-1">Capacity: {{ room.capacity }} students</p>
           
           <div class="mt-4 flex justify-end">
             <button (click)="deleteClassroom(room.id!)" class="text-red-600 text-xs font-medium hover:underline">Delete</button>
           </div>
        </div>
      </div>
      
      <div *ngIf="infraService.classrooms().length === 0" class="text-center py-12 text-[#525252]">
        No classrooms found.
      </div>
    </div>
  `
})
export class InfrastructureComponent {
  infraService = inject(InfrastructureService);
  toastService = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  showForm = false;
  newRoom: Classroom = { roomNumber: '', buildingName: '', capacity: 30, roomType: 'Lecture Hall' };

  addClassroom() {
    console.log('Attempting to add classroom:', this.newRoom); // Debug log

    if (!this.newRoom.roomNumber || !this.newRoom.buildingName) {
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    this.infraService.addClassroom(this.newRoom).subscribe({
      next: () => {
        console.log('Classroom added successfully');
        this.toastService.success('Classroom added successfully');
        this.newRoom = { roomNumber: '', buildingName: '', capacity: 30, roomType: 'Lecture Hall' };
        this.showForm = false;
      },
      error: (err) => {
        console.error('Failed to add classroom. Full error:', err);
        const errorMessage = err.error?.message || err.statusText || 'Unknown error';
        if (err.status === 404) {
          this.toastService.error('Infrastructure API not found (404). Backend might be down or stale.');
        } else if (err.status === 500) {
          this.toastService.error(`Server Error (500): ${errorMessage}. Check backend logs.`);
        } else {
          this.toastService.error(`Failed to add classroom: ${errorMessage}`);
        }
      }
    });
  }

  async deleteClassroom(id: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Classroom',
      message: 'Are you sure you want to delete this classroom?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      this.infraService.deleteClassroom(id).subscribe({
        next: () => {
          this.toastService.success('Classroom deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete classroom', err);
          this.toastService.error('Failed to delete classroom');
        }
      });
    }
  }
}
