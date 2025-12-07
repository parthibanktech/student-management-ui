import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-[#161616]">Payment History</h2>
        <p class="text-sm text-[#525252] mt-1">Track student payments and transactions</p>
      </div>

      <div class="bg-white border border-[#e0e0e0] shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-[#f4f4f4]">
            <tr>
               <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">ID</th>
               <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Student</th>
               <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Course</th>
               <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Amount</th>
               <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Status</th>
               <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Date</th>
               <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e0e0e0]">
             <tr *ngFor="let payment of paymentService.payments()">
               <td class="px-5 py-3">{{ payment.id }}</td>
               <td class="px-5 py-3">
                 <div class="font-medium text-gray-900">{{ payment.studentName || 'Unknown' }}</div>
                 <div class="text-xs text-gray-500">ID: {{ payment.studentId }}</div>
               </td>
               <td class="px-5 py-3">
                 <div class="font-medium text-gray-900">{{ payment.courseName || 'Unknown' }}</div>
                 <div class="text-xs text-gray-500">ID: {{ payment.courseId }}</div>
               </td>
               <td class="px-5 py-3 font-medium">\${{ payment.amount }}</td>
               <td class="px-5 py-3">
                 <span [class.text-green-600]="payment.status === 'SUCCESS' || payment.status === 'PAID'" 
                       [class.text-red-600]="payment.status === 'FAILED'"
                       [class.text-yellow-600]="payment.status === 'PENDING'"
                       [class.text-blue-600]="payment.status === 'REFUNDED'"
                       class="text-xs font-bold px-2 py-1 bg-gray-100 rounded">
                   {{ payment.status }}
                 </span>
               </td>
               <td class="px-5 py-3">{{ payment.paymentDate | date }}</td>
               <td class="px-5 py-3">
                 <button *ngIf="payment.status === 'PENDING'" 
                         (click)="pay(payment.id!)"
                         class="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition">
                     Pay Now
                 </button>
               </td>
             </tr>
             <tr *ngIf="paymentService.payments().length === 0">
               <td colspan="6" class="px-5 py-8 text-center text-[#525252]">No payment records found.</td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PaymentComponent {
  paymentService = inject(PaymentService);
  toastService = inject(ToastService);
  router = inject(Router);

  pay(id: number) {
    this.router.navigate(['/payment-gateway'], { queryParams: { paymentId: id } });
  }
}
