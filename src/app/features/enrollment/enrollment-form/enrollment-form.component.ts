import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnrollmentService } from '../../../services/enrollment.service';
import { StudentService } from '../../../services/student.service';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';
import { Student } from '../../../models/student.model';
import { Course } from '../../../models/course.model';

@Component({
    selector: 'app-enrollment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './enrollment-form.component.html',
    styleUrls: ['./enrollment-form.component.css']
})
export class EnrollmentFormComponent implements OnInit {
    enrollmentForm: FormGroup;
    students: Student[] = [];
    courses: Course[] = [];
    isLoading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private enrollmentService: EnrollmentService,
        private studentService: StudentService,
        private courseService: CourseService,
        private toastService: ToastService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.enrollmentForm = this.fb.group({
            studentId: ['', Validators.required],
            courseId: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        // Load students
        this.studentService.getStudents().subscribe({
            next: (students) => {
                this.students = students;
                this.cdr.markForCheck();
            },
            error: (err) => console.error('Error loading students', err)
        });

        // Load courses - Force reload to ensure freshness
        this.courseService.loadCourses().subscribe({
            next: (courses) => {
                this.courses = courses;
                this.cdr.markForCheck();
            },
            error: (err) => console.error('Error reloading courses', err)
        });
    }

    onSubmit(): void {
        if (this.enrollmentForm.valid) {
            this.isLoading = true;
            this.error = '';

            const { studentId, courseId } = this.enrollmentForm.value;
            const request = { studentId: Number(studentId), courseId: Number(courseId) };

            this.enrollmentService.enrollStudent(request).subscribe({
                next: (response: any) => {
                    this.isLoading = false;
                    if (response && response.status === 'CANCELLED') {
                        this.error = 'Enrollment failed due to service connection issues. Please check server logs.';
                        this.toastService.error('Enrollment failed: Backend Error');
                        console.error('Enrollment returned CANCELLED status:', response);
                    } else {
                        this.toastService.success('Student enrolled successfully');
                        this.router.navigate(['/enrollments']);
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    // Check if the backend returned a specific status or message
                    if (err.error && err.error.status === 'CANCELLED') {
                        this.error = 'Enrollment failed due to service connection issues. Please try again later.';
                        this.toastService.error('Enrollment failed: Connection issues');
                    } else {
                        this.error = 'Failed to enroll student. Please try again.';
                        this.toastService.error('Failed to enroll student');
                    }
                    console.error('Error enrolling student (HTTP Error):', err);
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/enrollments']);
    }
}
