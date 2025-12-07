import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { PaymentService } from '../../../services/payment.service';

@Component({
    selector: 'app-payment-gateway',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full bg-white shadow-xl rounded-lg overflow-hidden">
        
        <!-- Header -->
        <div class="bg-[#2a2a2a] p-4 flex justify-between items-center">
            <h2 class="text-white font-bold text-xl flex items-center gap-2">
                <span class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-mono">P</span>
                Razorpay
            </h2>
            <div class="text-gray-300 text-sm">Trusted Secure Payment</div>
        </div>

        <!-- Body -->
        <div class="p-8">
            <div class="text-center mb-8">
                <div class="text-sm text-gray-500 uppercase tracking-widest">Amount to Pay</div>
                <div class="text-4xl font-bold text-gray-900 mt-2">₹100.00</div>
            </div>

            <div class="space-y-4">
                <div class="border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors flex items-center gap-4"
                     [class.border-blue-500]="selectedMethod === 'card'"
                     [class.bg-blue-50]="selectedMethod === 'card'"
                     (click)="selectedMethod = 'card'">
                    <div class="text-2xl">💳</div>
                    <div>
                        <div class="font-medium text-gray-900">Credit / Debit Card</div>
                        <div class="text-xs text-gray-500">Visa, Mastercard, Rupay</div>
                    </div>
                </div>

                <div class="border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors flex items-center gap-4"
                     [class.border-blue-500]="selectedMethod === 'upi'"
                     [class.bg-blue-50]="selectedMethod === 'upi'"
                     (click)="selectedMethod = 'upi'">
                    <div class="text-2xl">📱</div>
                    <div>
                        <div class="font-medium text-gray-900">UPI / QR Code</div>
                        <div class="text-xs text-gray-500">GPay, PhonePe, Paytm</div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="processing" class="mt-8 text-center animate-pulse">
                <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto animate-spin mb-4"></div>
                <p class="text-gray-600 font-medium">Processing secure payment...</p>
                <p class="text-xs text-gray-400 mt-1">Do not close this window</p>
            </div>

            <!-- Pay Button -->
            <button *ngIf="!processing"
                    (click)="processPayment()"
                    class="mt-8 w-full bg-[#3395ff] hover:bg-[#2879d6] text-white font-bold py-4 rounded-md shadow-lg transition-transform transform active:scale-95 flex justify-center items-center gap-2">
                Pay ₹100.00
            </button>
            
            <button *ngIf="!processing" (click)="cancel()" class="mt-4 w-full text-gray-500 text-sm hover:underline">
                Cancel Transaction
            </button>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Secured by Razorpay</span>
            <div class="flex gap-2">
                <span>PCI-DSS Compliant</span>
                <span>•</span>
                <span>256-bit Encryption</span>
            </div>
        </div>
      </div>
    </div>
  `
})

export class PaymentGatewayComponent implements OnInit {
    router = inject(Router);
    route = inject(ActivatedRoute);
    toastService = inject(ToastService);
    paymentService = inject(PaymentService);

    selectedMethod = 'upi';
    processing = false;
    paymentId: number | null = null;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.paymentId = params['paymentId'] ? Number(params['paymentId']) : null;
        });
    }

    processPayment() {
        this.processing = true;

        // Simulate API delay
        setTimeout(() => {
            if (this.paymentId) {
                this.paymentService.completePayment(this.paymentId).subscribe({
                    next: () => {
                        this.processing = false;
                        this.toastService.success('Payment Successful! Transaction ID: ' + Math.random().toString(36).substr(2, 9).toUpperCase());
                        this.router.navigate(['/payments']);
                    },
                    error: (err) => {
                        this.processing = false;
                        console.error('Payment failed', err);
                        this.toastService.error('Payment verification failed.');
                    }
                });
            } else {
                this.processing = false;
                // Fallback for demo if no paymentId provided
                this.toastService.success('Payment Successful (Demo)!');
                this.router.navigate(['/payments']);
            }
        }, 3000); // 3 second delay
    }

    cancel() {
        this.router.navigate(['/enrollments']);
    }
}
