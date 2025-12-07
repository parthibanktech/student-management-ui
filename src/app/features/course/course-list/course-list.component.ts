import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';
import { Course } from '../../../models/course.model';
import { ConfirmationService } from '../../../services/confirmation.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900"><span class="text-blue-600">Parthiban</span> Courses</h2>
          <p class="text-sm text-gray-500 mt-1">Manage and organize your educational courses</p>
        </div>
        <a routerLink="/courses/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
          <span class="text-xl leading-none">+</span> Add New Course
        </a>
      </div>

      <!-- Course List -->
      <div class="w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="courseService.courses().length > 0; else emptyState">
          <div *ngFor="let course of courseService.courses()" class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group h-full flex flex-col overflow-hidden">
            <div class="p-5 flex-1">
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{{ course.title }}</h4>
                <span class="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ml-2">
                  {{ course.credits }} Credits
                </span>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">{{ course.description || 'No description provided.' }}</p>
            </div>
            <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button (click)="deleteCourse(course.id!)" 
                 class="text-red-500 hover:bg-red-50 hover:text-red-700 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors">
                 Delete
              </button>
            </div>
          </div>
        </div>
        
        <ng-template #emptyState>
          <div class="text-center py-20 bg-white border border-gray-200 rounded-lg">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-500">
               <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No courses available</h3>
            <p class="text-gray-500 mt-1 mb-6">Get started by creating your first course using the button above.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class CourseListComponent {
  courseService = inject(CourseService);
  toastService = inject(ToastService);
  confirmationService = inject(ConfirmationService);

  async deleteCourse(id: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Course',
      message: 'Are you sure you want to delete this course?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.toastService.success('Course deleted successfully'),
        error: (err) => {
          console.error('Delete Course Error:', err);
          if (err.status === 409 || err.status === 500) {
            this.toastService.error('Cannot delete course. It may have enrolled students.');
          } else {
            this.toastService.error('Failed to delete course');
          }
        }
      });
    }
  }
}
