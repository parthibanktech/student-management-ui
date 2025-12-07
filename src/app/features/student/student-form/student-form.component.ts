import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
      <!-- Name Input -->
      <div class="flex flex-col gap-2">
        <label for="name" class="bx--label">Name</label>
        <input type="text" id="name" formControlName="name" 
          class="bx--text-input"
          [class.border-red-500]="studentForm.get('name')?.invalid && (studentForm.get('name')?.dirty || studentForm.get('name')?.touched)"
          placeholder="Enter student name">
        <div *ngIf="studentForm.get('name')?.invalid && (studentForm.get('name')?.dirty || studentForm.get('name')?.touched)" class="text-[#da1e28] text-xs mt-1">
            Name is required.
        </div>
      </div>

      <!-- Email Input -->
      <div class="flex flex-col gap-2">
        <label for="email" class="bx--label">Email</label>
        <input type="email" id="email" formControlName="email" 
          class="bx--text-input"
          [class.border-red-500]="studentForm.get('email')?.invalid && (studentForm.get('email')?.dirty || studentForm.get('email')?.touched)"
          placeholder="Enter email address">
        <div *ngIf="studentForm.get('email')?.invalid && (studentForm.get('email')?.dirty || studentForm.get('email')?.touched)" class="text-[#da1e28] text-xs mt-1">
            <span *ngIf="studentForm.get('email')?.errors?.['required']">Email is required.</span>
            <span *ngIf="studentForm.get('email')?.errors?.['email']">Please enter a valid email.</span>
        </div>
      </div>

      <!-- Contact Input -->
      <div class="flex flex-col gap-2">
        <label for="contact" class="bx--label">Contact</label>
        <input type="text" id="contact" formControlName="contact" 
          class="bx--text-input"
          [class.border-red-500]="studentForm.get('contact')?.invalid && (studentForm.get('contact')?.dirty || studentForm.get('contact')?.touched)"
          placeholder="Enter contact number (10 digits)"
          (input)="onContactInput($event)"
          maxlength="10">
        <div *ngIf="studentForm.get('contact')?.invalid && (studentForm.get('contact')?.dirty || studentForm.get('contact')?.touched)" class="text-[#da1e28] text-xs mt-1">
            <span *ngIf="studentForm.get('contact')?.errors?.['required']">Contact is required.</span>
            <span *ngIf="studentForm.get('contact')?.errors?.['pattern']">Please enter a valid 10-digit mobile number.</span>
        </div>
      </div>

      <!-- City Input -->
      <div class="flex flex-col gap-2">
        <label for="city" class="bx--label">City</label>
        <input type="text" id="city" formControlName="city" 
          class="bx--text-input"
          [class.border-red-500]="studentForm.get('city')?.invalid && (studentForm.get('city')?.dirty || studentForm.get('city')?.touched)"
          placeholder="Enter city">
        <div *ngIf="studentForm.get('city')?.invalid && (studentForm.get('city')?.dirty || studentForm.get('city')?.touched)" class="text-[#da1e28] text-xs mt-1">
            City is required.
        </div>
      </div>

      <!-- Grade Select -->
      <div class="flex flex-col gap-2 relative">
        <label for="grade" class="bx--label">Grade</label>
        <select id="grade" formControlName="grade" 
          class="bx--text-input appearance-none"
          [class.border-red-500]="studentForm.get('grade')?.invalid && (studentForm.get('grade')?.dirty || studentForm.get('grade')?.touched)">
          <option value="" disabled selected>Select Grade</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
        <div *ngIf="studentForm.get('grade')?.invalid && (studentForm.get('grade')?.dirty || studentForm.get('grade')?.touched)" class="text-[#da1e28] text-xs mt-1">
            Grade is required.
        </div>
        <div class="absolute right-4 top-9 pointer-events-none text-[#161616]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 pt-6 border-t border-[#e0e0e0]">
        <button type="button" (click)="onCancel()" 
          class="px-4 py-3 text-sm font-medium text-[#161616] bg-[#f4f4f4] hover:bg-[#e0e0e0] transition-colors">
          Cancel
        </button>
        <button type="submit" [disabled]="studentForm.invalid" 
          class="bx--btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          Save Student
        </button>
      </div>
    </form>
  `
})
export class StudentFormComponent implements OnChanges {
  @Input() student: Student | null = null;
  @Output() save = new EventEmitter<Student>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  studentForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    city: ['', Validators.required],
    grade: ['', Validators.required],
    enrollmentDate: [new Date().toISOString().split('T')[0]] // Format as yyyy-MM-dd
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student'] && this.student) {
      this.studentForm.patchValue(this.student);
    } else if (changes['student'] && !this.student) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      this.studentForm.reset({
        enrollmentDate: formattedDate
      });
    }
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.save.emit(this.studentForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onContactInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.studentForm.get('contact')?.setValue(input.value);
  }
}
