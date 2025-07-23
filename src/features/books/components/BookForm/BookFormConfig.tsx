import { Book } from '@/types/models/books'; // Adjust path based on actual location

export const defaultBookFormValues = {
  title: '', 
  author: '', 
  isbn: '',
  publicationYear: null, 
  quantityInStock: 0,
  materialType: 'Book', 
  genre: '',
  publisher: '',
  availableCopies: 0,
  description: '',
  coverUrl: '',
  language: 'es', 
  pages: 0,
  location: '',
};

/**
 * Maps a Book model object to the format expected by the BookForm.
 * @param {Book | null | undefined} book - The Book model object to map.
 * @returns {typeof defaultBookFormValues} The formatted object for form reset.
 */
export const mapBookToFormValues = (book: Book | null | undefined) => {
  if (!book) {
    return defaultBookFormValues;
  }

  return {
    title: book.title ?? '', 
    author: book.author ?? '', 
    isbn: book.isbn ?? '',
    publicationYear: book.publicationYear ?? null, 
    quantityInStock: book.quantityInStock ?? 0, 
    materialType: book.materialType ?? 'Book', 
    genre: book.genre ?? '',
    publisher: book.publisher ?? '',
    availableCopies: book.availableCopies ?? 0,
    description: book.description ?? '',
    coverUrl: book.coverUrl ?? '',
    language: book.language ?? 'es', 
    pages: book.pages ?? 0,
    location: book.location ?? '',
  };
};

export type BookFormData = typeof defaultBookFormValues;