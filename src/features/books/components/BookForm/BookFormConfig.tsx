// Correcting the import statement based on the file structure
import { Book } from '@/features/books/api/booksApiSlice';

// Correcting the default form values to match the Book type structure
export const defaultBookFormValues = {
  title: '',
  author: '',
  isbn: '',
  publication_date: undefined as string | undefined,
  pages: undefined as number | undefined,
  available_copies: undefined as number | undefined,
  quantity_in_stock: undefined as number | undefined,
  language: 'es',
  publisher: '',
  genres: [] as string[],
  description: '',
  cover_url: '',
  material_type: '',
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
    publication_date: book.publication_date ?? undefined,
    pages: book.pages ?? undefined,
    available_copies: book.available_copies ?? undefined,
    quantity_in_stock: book.quantity_in_stock ?? undefined,
    language: book.language ?? 'es',
    publisher: book.publisher ?? '',
    genres: book.genres ?? [],
    description: book.description ?? '',
    cover_url: book.cover_url ?? '',
    material_type: book.material_type ?? '',
  };
};

export type BookFormData = typeof defaultBookFormValues;