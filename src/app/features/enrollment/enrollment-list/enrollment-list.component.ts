import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-semibold text-[#161616]"><span class="text-[#0f62fe]">Parthiban</span> Enrollment Management</h2>
          <p class="text-sm text-[#525252] mt-1">Track and manage student enrollments</p>
        </div>
        <a routerLink="/enrollments/new" class="bx--btn-primary flex items-center gap-2">
          <span class="text-xl leading-none">+</span> Enroll New Student
        </a>
      </div>

      <!-- Filters -->
      <div class="mb-6 bg-white p-4 border border-[#e0e0e0] flex items-center gap-4">
          <div class="flex items-center gap-2">
             <span class="text-xs font-bold text-[#525252] uppercase tracking-wider">Filter by Student</span>
             <select (change)="onStudentFilterChange($event)" class="bx--text-input w-64">
                <option value="">All Students</option>
                <option *ngFor="let student of studentService.students()" [value]="student.id">
                    {{ student.name }} (ID: {{ student.id }})
                </option>
             </select>
          </div>
      </div>

      <!-- Enrollment List -->
      <div class="bg-white border border-[#e0e0e0] shadow-sm">
        <div class="overflow-x-auto">
          <table class="bx--data-table">
            <thead>
              <tr class="bx--data-table-header">
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let enrollment of enrollmentService.enrollments()" class="hover:bg-[#e8f0fe] transition-colors border-b border-[#e0e0e0]">
                <td class="font-mono text-xs text-[#525252]">#{{ enrollment.id }}</td>
                <td>
                   <div class="font-medium text-[#161616]">{{ enrollment.studentName || 'Unknown Student' }}</div>
                   <div class="text-xs text-[#525252]">ID: {{ enrollment.studentId }}</div>
                </td>
                <td>
                   <div class="font-medium text-[#161616]">{{ enrollment.courseTitle || 'Unknown Course' }}</div>
                   <div class="text-xs text-[#525252]">ID: {{ enrollment.courseId }}</div>
                </td>
                <td class="text-[#525252]">{{ enrollment.enrollmentDate | date:'mediumDate' }}</td>
                <td>
                  <span [class.bg-green-100]="enrollment.status === 'ACTIVE' || enrollment.status === 'CONFIRMED'"
                        [class.text-green-800]="enrollment.status === 'ACTIVE' || enrollment.status === 'CONFIRMED'"
                        [class.bg-yellow-100]="enrollment.status === 'PENDING'"
                        [class.text-yellow-800]="enrollment.status === 'PENDING'"
                        [class.bg-red-100]="enrollment.status === 'DROPPED' || enrollment.status === 'CANCELLED'"
                        [class.text-red-800]="enrollment.status === 'DROPPED' || enrollment.status === 'CANCELLED'"
                        class="px-2 py-1 text-xs font-bold rounded-md">
                    {{ enrollment.status || 'PENDING' }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                       <button *ngIf="enrollment.status === 'PENDING'" 
                               (click)="payNow(enrollment)" 
                               class="text-[#0f62fe] bg-[#d0e2ff] hover:bg-[#a6c8ff] px-3 py-1 text-xs font-bold rounded transition-colors">
                           Pay Now
                       </button>

                      <button (click)="deleteEnrollment(enrollment.id!)" 
                              class="text-[#da1e28] hover:text-[#b81922] px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors">
                        Delete
                      </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="enrollmentService.enrollments().length === 0">
                <td colspan="6" class="p-12 text-center text-[#525252]">
                  No enrollments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class EnrollmentListComponent {
  enrollmentService = inject(EnrollmentService);
  studentService = inject(StudentService);
  paymentService = inject(PaymentService);
  toastService = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);

  constructor() {
    this.studentService.loadStudents();
    this.paymentService.loadPayments();
    this.enrollmentService.loadEnrollments();
  }

  onStudentFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const studentId = select.value ? parseInt(select.value) : null;
    if (studentId) {
      this.enrollmentService.getEnrollmentsByStudent(studentId).subscribe();
    } else {
      this.enrollmentService.loadEnrollments();
    }
  }

  async deleteEnrollment(id: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Enrollment',
      message: 'Are you sure you want to delete this enrollment?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      this.enrollmentService.deleteEnrollment(id).subscribe({
        next: () => {
          this.toastService.success('Enrollment deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete enrollment', err);
          this.toastService.error('Failed to delete enrollment');
        }
      });
    }
  }

  payNow(enrollment: any) {
    const payment = this.paymentService.payments().find(p => p.enrollmentId === enrollment.id);
    if (payment) {
      this.router.navigate(['/payment-gateway'], { queryParams: { paymentId: payment.id } });
    } else {
      // Auto-Retry Logic
      console.warn('Payment record not found for enrollment', enrollment.id, ' - Retrying initialization...');
      this.toastService.info('Initializing payment system... Please wait.');

      this.enrollmentService.retryEnrollment(enrollment.id).subscribe({
        next: () => {
          this.toastService.success('System initialized. Please click Pay Now again.');
          // Reload payments after a short delay to allow backend to process
          setTimeout(() => this.paymentService.loadPayments(), 1000);
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('System Error: Payment initialization failed. Please try again later.');
        }
      });
    }
  }
}
