import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    private _options = signal<ConfirmationOptions | null>(null);
    private _isOpen = signal<boolean>(false);
    private _resolve: ((result: boolean) => void) | null = null;

    options = this._options.asReadonly();
    isOpen = this._isOpen.asReadonly();

    confirm(options: ConfirmationOptions): Promise<boolean> {
        this._options.set({
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            type: 'danger',
            ...options
        });
        this._isOpen.set(true);

        return new Promise<boolean>((resolve) => {
            this._resolve = resolve;
        });
    }

    resolve(result: boolean) {
        this._isOpen.set(false);
        if (this._resolve) {
            this._resolve(result);
            this._resolve = null;
        }
    }
}
