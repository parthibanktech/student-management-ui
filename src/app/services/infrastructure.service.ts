import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

export interface Classroom {
    id?: number;
    roomNumber: string;
    buildingName: string;
    capacity: number;
    roomType: string;
}

@Injectable({
    providedIn: 'root'
})
export class InfrastructureService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/infrastructure/classrooms`;

    classrooms = signal<Classroom[]>([]);

    constructor() {
        this.loadClassrooms();
    }

    loadClassrooms() {
        this.http.get<Classroom[]>(this.apiUrl).subscribe(classrooms => {
            this.classrooms.set(classrooms);
        });
    }

    addClassroom(classroom: Classroom) {
        return this.http.post<Classroom>(this.apiUrl, classroom).pipe(
            tap(() => this.loadClassrooms())
        );
    }

    deleteClassroom(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.loadClassrooms())
        );
    }
}
