import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

export interface Book {
    id?: number;
    title: string;
    author: string;
    isbn: string;
    available: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/library/books`;

    books = signal<Book[]>([]);

    constructor() {
        this.loadBooks();
    }

    loadBooks() {
        this.http.get<Book[]>(this.apiUrl).subscribe(books => {
            this.books.set(books);
        });
    }

    addBook(book: Book) {
        return this.http.post<Book>(this.apiUrl, book).pipe(
            tap(newBook => this.books.update(books => [...books, newBook]))
        );
    }

    deleteBook(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.books.update(books => books.filter(b => b.id !== id)))
        );
    }
}
