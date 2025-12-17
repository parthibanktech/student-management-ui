import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

/**
 * Interface representing a Payment Record.
 * Matches the Backend DTO structure.
 */
export interface Payment {
    id?: number;
    enrollmentId?: number;
    studentId: number;
    studentName?: string;
    courseId?: number;
    courseName?: string;
    amount: number;
    paymentDate: string;
    // Status enum matches backend Payment.PaymentStatus
    status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'PAID' | 'REFUNDED';
}

/**
 * ==========================================================================================================
 * PAYMENT SERVICE (FRONTEND)
 * ==========================================================================================================
 * Manages Payment interactions.
 * 
 * FEATURES:
 * - Load/Create Payments.
 * - 'completePayment' mock trigger for the Saga.
 */
@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/payments`;

    payments = signal<Payment[]>([]);

    constructor() {
        this.loadPayments();
    }

    loadPayments() {
        this.http.get<Payment[]>(this.apiUrl).subscribe(payments => {
            this.payments.set(payments);
        });
    }

    createPayment(payment: Payment) {
        return this.http.post<Payment>(this.apiUrl, payment).pipe(
            tap(newPayment => this.payments.update(payments => [...payments, newPayment]))
        );
    }

    completePayment(id: number) {
        return this.http.post<Payment>(`${this.apiUrl}/${id}/complete`, {}).pipe(
            tap(updatedPayment => {
                this.payments.update(payments =>
                    payments.map(p => p.id === updatedPayment.id ? updatedPayment : p)
                );
            })
        );
    }
}
