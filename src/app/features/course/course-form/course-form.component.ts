import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-course-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './course-form.component.html',
    styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent {
    courseForm: FormGroup;
    isLoading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private courseService: CourseService,
        private toastService: ToastService,
        private router: Router
    ) {
        this.courseForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            credits: [3, [Validators.required, Validators.min(1), Validators.max(10)]]
        });
    }

    onSubmit(): void {
        if (this.courseForm.valid) {
            this.isLoading = true;
            this.error = '';

            this.courseService.createCourse(this.courseForm.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.toastService.success('Course created successfully');
                    this.router.navigate(['/courses']);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.error = 'Failed to create course. Please try again.';
                    this.toastService.error('Failed to create course');
                    console.error('Error creating course:', err);
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/courses']);
    }
}
