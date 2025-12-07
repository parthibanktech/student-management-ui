import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="confirmationService.isOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <!-- Backdrop -->
      <div (click)="cancel()" class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

      <!-- Modal Panel -->
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all p-6 overflow-hidden scale-100 opacity-100">
        <!-- Icon & Title -->
        <div class="flex items-start gap-4 mb-4">
          <div [ngClass]="{
            'bg-red-100 text-red-600': confirmationService.options()?.type === 'danger',
            'bg-yellow-100 text-yellow-600': confirmationService.options()?.type === 'warning',
            'bg-blue-100 text-blue-600': confirmationService.options()?.type === 'info'
          }" class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <svg *ngIf="confirmationService.options()?.type === 'danger'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
             <svg *ngIf="confirmationService.options()?.type === 'warning'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg *ngIf="confirmationService.options()?.type === 'info'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 leading-6">
              {{ confirmationService.options()?.title }}
            </h3>
            <div class="mt-2 text-sm text-gray-500">
              <p>{{ confirmationService.options()?.message }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="cancel()" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            {{ confirmationService.options()?.cancelText }}
          </button>
          <button (click)="confirm()" 
            [ngClass]="{
              'bg-red-600 hover:bg-red-700 focus:ring-red-500': confirmationService.options()?.type === 'danger',
              'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500': confirmationService.options()?.type === 'warning',
              'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': confirmationService.options()?.type === 'info'
            }"
            class="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors">
            {{ confirmationService.options()?.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent {
    confirmationService = inject(ConfirmationService);

    confirm() {
        this.confirmationService.resolve(true);
    }

    cancel() {
        this.confirmationService.resolve(false);
    }
}
