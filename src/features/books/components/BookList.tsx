import React from 'react';
import { BookCard } from './BookCard';
import { Book } from '@/features/books/api/booksApiSlice';
import { BookOpen } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onEdit: (bookData: Omit<Book, "id" | "created_at" | "updated_at">) => void;
  onDelete: (bookId: string) => void;
}

export function BookList({ books, onEdit, onDelete }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron libros</h3>
        <p className="text-gray-500">
          No hay libros que coincidan con los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}