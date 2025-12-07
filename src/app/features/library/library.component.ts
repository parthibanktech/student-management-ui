import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService, Book } from '../../services/library.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-semibold text-[#161616]">Library Management</h2>
          <p class="text-sm text-[#525252] mt-1">Manage books and resources</p>
        </div>
        <button (click)="showForm = !showForm" class="bx--btn-primary">
          {{ showForm ? 'Cancel' : '+ Add New Book' }}
        </button>
      </div>

      <!-- Add Book Form -->
      <div *ngIf="showForm" class="bg-white p-6 border border-[#e0e0e0] mb-8 shadow-sm">
        <h3 class="text-lg font-medium mb-4">Add New Book</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input [(ngModel)]="newBook.title" placeholder="Book Title" class="bx--text-input">
          <input [(ngModel)]="newBook.author" placeholder="Author" class="bx--text-input">
          <input [(ngModel)]="newBook.isbn" placeholder="ISBN" class="bx--text-input">
        </div>
        <div class="mt-4 flex justify-end">
          <button (click)="addBook()" class="bg-[#0f62fe] text-white px-4 py-2 hover:bg-[#0353e9]">Save Book</button>
        </div>
      </div>

      <!-- Books Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let book of libraryService.books()" class="flex flex-col bg-white border border-[#e0e0e0] rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow h-full w-full">
           <div class="flex justify-between items-start mb-2">
             <h4 class="font-bold text-[#161616] text-lg line-clamp-2 leading-tight">{{ book.title }}</h4>
             <span class="text-[10px] uppercase font-bold tracking-wider bg-green-100 text-green-800 px-2 py-1 rounded-sm whitespace-nowrap ml-2">Available</span>
           </div>
           <p class="text-sm text-[#525252] mb-1">by <span class="font-medium text-[#161616]">{{ book.author }}</span></p>
           <p class="text-xs text-[#525252] font-mono mb-4">ISBN: {{ book.isbn }}</p>
           
           <div class="mt-auto pt-4 border-t border-gray-100">
             <button (click)="deleteBook(book.id!)" class="text-red-600 hover:text-red-800 text-xs font-semibold uppercase tracking-wide flex items-center gap-1 transition-colors">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Delete Book
             </button>
           </div>
        </div>
      </div>

      <div *ngIf="libraryService.books().length === 0" class="text-center py-16 bg-white border border-dashed border-gray-300 rounded-lg">
         <p class="text-[#525252] text-lg">No books available in the library.</p>
         <button (click)="showForm = true" class="mt-4 text-[#0f62fe] hover:underline text-sm font-medium">Add your first book</button>
      </div>
    </div>
  `
})
export class LibraryComponent {
  libraryService = inject(LibraryService);
  toastService = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  showForm = false;
  newBook: Book = { title: '', author: '', isbn: '', available: true };

  addBook() {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.isbn) {
      this.toastService.warning('Please fill in all required fields');
      return;
    }

    this.libraryService.addBook(this.newBook).subscribe({
      next: () => {
        this.toastService.success('Book added successfully');
        this.newBook = { title: '', author: '', isbn: '', available: true };
        this.showForm = false;
      },
      error: (err) => {
        console.error('Failed to add book', err);
        this.toastService.error('Failed to add book');
      }
    });
  }

  async deleteBook(id: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Delete Book',
      message: 'Are you sure you want to delete this book? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      this.libraryService.deleteBook(id).subscribe({
        next: () => {
          this.toastService.success('Book deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete book', err);
          this.toastService.error('Failed to delete book');
        }
      });
    }
  }
}
