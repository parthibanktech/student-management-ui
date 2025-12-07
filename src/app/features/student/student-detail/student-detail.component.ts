import { Component, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { Student } from '../../../models/student.model';
import { Enrollment } from '../../../models/enrollment.model';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6" *ngIf="student()">
      <div class="mb-6">
        <a routerLink="/students" class="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Students
        </a>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div class="bg-indigo-600 px-6 py-4">
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="bg-white text-indigo-600 rounded-full h-10 w-10 flex items-center justify-center text-lg">
              {{ student()?.name?.charAt(0) }}
            </span>
            {{ student()?.name }}
          </h1>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Contact Info</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-900">{{ student()?.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-gray-900">{{ student()?.address }}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Academic Info</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span class="text-gray-900">Grade: {{ student()?.grade }}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-900">Enrolled: {{ student()?.enrollmentDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-800">Course Enrollments</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let enrollment of enrollments()">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ enrollment.courseTitle || 'Course #' + enrollment.courseId }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ enrollment.enrollmentDate | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    [class.bg-green-100]="enrollment.status === 'ACTIVE'"
                    [class.text-green-800]="enrollment.status === 'ACTIVE'"
                    [class.bg-blue-100]="enrollment.status === 'COMPLETED'"
                    [class.text-blue-800]="enrollment.status === 'COMPLETED'"
                    [class.bg-red-100]="enrollment.status === 'DROPPED'"
                    [class.text-red-800]="enrollment.status === 'DROPPED'">
                    {{ enrollment.status || 'ACTIVE' }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="enrollments().length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                  No enrollments found for this student.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);

  student = signal<Student | null>(null);
  enrollments = signal<Enrollment[]>([]);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadStudent(id);
        this.loadEnrollments(id);
      }
    });
  }

  private loadStudent(id: number) {
    // We might need to implement getStudentById in the service if it's not there or use the list
    // For now, let's try to find it in the existing list or fetch it
    const found = this.studentService.students().find(s => s.id === id);
    if (found) {
      this.student.set(found);
    } else {
      // Fallback if not in list (e.g. direct link) - assuming service has getById
      // this.studentService.getStudentById(id).subscribe(s => this.student.set(s));
    }
  }

  private loadEnrollments(studentId: number) {
    this.enrollmentService.getEnrollmentsByStudent(studentId).subscribe(
      data => this.enrollments.set(data)
    );
  }
}
