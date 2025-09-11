// Correcting the import statement based on the file structure
import { Book } from '@/features/content-management/api/booksApiSlice';

// Correcting the default form values to match the Book type structure
export const defaultBookFormValues = {
  title: '',
  isbn: '',
  publication_date: undefined as string | undefined,
  pages: undefined as number | undefined,
  quantity_in_stock: undefined as number | undefined,
  publisher: '',
  description: '',
  cover: '',
  digital_file: '',
  authors: [] as string[],
  genres: [] as string[],
  material_type: '',
  language: '',
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
    isbn: book.isbn ?? '',
    publication_date: book.publication_date ?? undefined,
    pages: book.pages ?? undefined,
    quantity_in_stock: book.quantity_in_stock ?? undefined,
    publisher: book.publisher ?? '',
    description: book.description ?? '',
    cover: book.cover ?? '',
    digital_file: book.digital_file ?? '',
    authors: book.authors_detail.map((author) => author.name) ?? [],
    genres: book.genres_detail.map((genre) => genre.label) ?? [],
    material_type: book.material_type_detail?.name ?? '',
    language: book.language_detail?.name ?? '',
  };
};

export type BookFormData = typeof defaultBookFormValues;