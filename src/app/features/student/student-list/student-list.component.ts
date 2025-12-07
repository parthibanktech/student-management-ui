import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { StudentFormComponent } from '../student-form/student-form.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentFormComponent, RouterModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-semibold text-[#161616]"><span class="text-[#0f62fe]">Parthiban</span> Students</h2>
          <p class="text-sm text-[#525252] mt-1">Manage and organize student records</p>
        </div>
        <div class="flex items-center gap-4">
            <div class="relative w-72">
                 <input type="text"
                  class="bx--text-input" 
                  placeholder="Search students..."
                  [ngModel]="searchTerm()" 
                  (ngModelChange)="searchTerm.set($event)">
            </div>
            <button (click)="openAddModal()" class="bx--btn-primary">
              <span class="text-xl leading-none">+</span> Add New Student
            </button>
        </div>
      </div>

      <!-- Student List -->
      <div class="bg-white border border-[#e0e0e0] shadow-sm">
        <div class="overflow-x-auto">
          <table class="bx--data-table">
            <thead>
              <tr class="bx--data-table-header">
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>City</th>
                <th>Grade</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of filteredStudents()" class="hover:bg-[#e8f0fe] transition-colors border-b border-[#e0e0e0]">
                <td class="font-medium text-[#161616]">{{ student.name }}</td>
                <td class="text-[#525252]">{{ student.email }}</td>
                <td class="text-[#525252]">{{ student.contact || '-' }}</td>
                <td class="text-[#525252]">{{ student.city || '-' }}</td>
                <td>
                  <span [class]="'px-2 py-1 text-xs font-bold font-mono rounded-md ' + getGradeClass(student.grade)">
                    {{ student.grade || '-' }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                      <button (click)="openEditModal(student)" class="text-[#0f62fe] hover:text-[#0353e9] px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors">
                        Edit
                      </button>
                      <button (click)="handleDelete(student.id)" class="text-[#da1e28] hover:text-[#b81922] px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors">
                        Delete
                      </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredStudents().length === 0">
                <td colspan="6" class="p-12 text-center">
                  <div class="flex flex-col items-center justify-center text-[#525252]">
                    <div class="mb-4 bg-[#f4f4f4] p-4 rounded-full">
                       <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <p class="text-lg font-medium text-[#161616] mb-1">No students found</p>
                    <p class="text-sm mb-4">Try adjusting your search or add a new student.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div *ngIf="showModal()" class="bx--modal-container">
      <div class="bx--modal-content">
        <!-- Modal Header -->
        <div class="bx--modal-header">
          <h3 class="text-lg font-semibold text-[#161616]">
            {{ selectedStudent() ? 'Edit Student' : 'Add New Student' }}
          </h3>
          <button (click)="closeModal()" class="text-[#525252] hover:text-[#161616] transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Modal Body (Form) -->
        <div class="p-6">
          <app-student-form [student]="selectedStudent()" (save)="handleSave($event)" (cancel)="closeModal()">
          </app-student-form>
        </div>
      </div>
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListComponent {
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);

  searchTerm = signal('');
  students = this.studentService.students;

  filteredStudents = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.students();
    }
    return this.students().filter(student =>
      student.name.toLowerCase().includes(term) ||
      (student.email && student.email.toLowerCase().includes(term))
    );
  });

  showModal = signal(false);
  selectedStudent = signal<Student | null>(null);

  openAddModal(): void {
    this.selectedStudent.set(null);
    this.showModal.set(true);
  }

  openEditModal(student: Student): void {
    this.selectedStudent.set(student);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  handleSave(student: Student): void {
    if (student.id) {
      this.studentService.updateStudent(student).subscribe({
        next: () => {
          this.toastService.success('Student updated successfully');
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update student', err);
          if (err.error && typeof err.error === 'string') {
            this.toastService.error(err.error);
          } else if (err.error && typeof err.error === 'object') {
            const messages = Object.values(err.error).join(', ');
            this.toastService.error(messages || 'Failed to update student');
          } else {
            this.toastService.error('Failed to update student');
          }
        }
      });
    } else {
      const { id, ...newStudentData } = student;
      this.studentService.addStudent(newStudentData as Omit<Student, 'id'>).subscribe({
        next: () => {
          this.toastService.success('Student added successfully');
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to add student', err);
          if (err.error && typeof err.error === 'string') {
            this.toastService.error(err.error);
          } else if (err.error && typeof err.error === 'object') {
            const messages = Object.values(err.error).join(', ');
            this.toastService.error(messages || 'Failed to add student');
          } else {
            this.toastService.error('Failed to add student');
          }
        }
      });
    }
  }

  async handleDelete(id: number): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Student',
      message: 'Are you sure you want to delete this student? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.toastService.success('Student deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete student', err);
          if (err.error && typeof err.error === 'object') {
            const messages = Object.values(err.error).join(', ');
            this.toastService.error(messages || 'Failed to delete student');
          } else {
            this.toastService.error('Failed to delete student');
          }
        }
      });
    }
  }

  getGradeClass(grade: string | null | undefined): string {
    switch (grade) {
      case 'A': return 'bg-[#defbe6] text-[#0e6027] border border-[#defbe6]'; // Green
      case 'B': return 'bg-[#d0e2ff] text-[#0043ce] border border-[#d0e2ff]'; // Blue
      case 'C': return 'bg-[#e8daff] text-[#6929c4] border border-[#e8daff]'; // Purple
      case 'D': return 'bg-[#ffecb5] text-[#161616] border border-[#ffecb5]'; // Yellow
      case 'F': return 'bg-[#fff1f1] text-[#da1e28] border border-[#fff1f1]'; // Red
      default: return 'bg-[#f4f4f4] text-[#525252] border border-[#e0e0e0]'; // Gray
    }
  }
}
