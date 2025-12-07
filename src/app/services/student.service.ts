import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.model';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/students`;

  private studentsSignal = signal<Student[]>([]);
  students = this.studentsSignal.asReadonly();

  constructor() {
    this.loadStudents();
  }

  loadStudents(): void {
    this.http.get<Student[]>(this.baseUrl).pipe(
      catchError(err => {
        console.error('Error loading students', err);
        throw err;
      })
    ).subscribe(students => {
      this.studentsSignal.set(students);
    });
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student).pipe(
      tap(() => {
        // Reload all students to ensure consistency with backend
        this.loadStudents();
      }),
      catchError(err => {
        console.error('Error adding student', err);
        throw err;
      })
    );
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${student.id}`, student).pipe(
      tap(() => {
        // Reload all students to ensure consistency with backend
        this.loadStudents();
      }),
      catchError(err => {
        console.error('Error updating student', err);
        throw err;
      })
    );
  }

  deleteStudent(id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        // Reload all students to ensure consistency with backend
        this.loadStudents();
      }),
      catchError(err => {
        console.error('Error deleting student', err);
        throw err;
      })
    );
  }
}
