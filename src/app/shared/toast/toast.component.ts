import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-3 items-center w-full max-w-md pointer-events-none">
      <div *ngFor="let toast of toastService.toasts()" 
           [class]="'pointer-events-auto min-w-[350px] max-w-[90%] p-6 rounded-xl shadow-2xl transform transition-all duration-300 flex justify-between items-center text-white font-medium text-lg border-2 border-white/20 ' + 
           (toast.type === 'success' ? 'bg-green-600' : 
            toast.type === 'error' ? 'bg-red-600' : 
            toast.type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600')">
        <div class="flex items-center gap-4">
          <span *ngIf="toast.type === 'success'" class="text-2xl bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">✓</span>
          <span *ngIf="toast.type === 'error'" class="text-2xl bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">✕</span>
          <span *ngIf="toast.type === 'warning'" class="text-2xl bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">⚠</span>
          <span *ngIf="toast.type === 'info'" class="text-2xl bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">ℹ</span>
          <span>{{ toast.message }}</span>
        </div>
        <button (click)="toastService.remove(toast.id)" class="ml-6 hover:bg-white/20 rounded-full p-2 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
