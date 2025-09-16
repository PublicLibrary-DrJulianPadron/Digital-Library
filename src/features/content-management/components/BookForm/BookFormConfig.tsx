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
  cover: undefined as File | string | undefined,
  digital_file: undefined as File | string | undefined,
  authors: [] as string[],
  genres: [] as string[],
  material_type: '',
  language: '',
};

export type BookFormData = typeof defaultBookFormValues;

// Map from Book to form values
export const mapBookToFormValues = (book: Book | null | undefined): BookFormData => {
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
    cover: book.cover ?? undefined,
    digital_file: book.digital_file ?? undefined,
    authors: book.authors_detail.map(a => a.name) ?? [],
    genres: book.genres_detail.map(g => g.label) ?? [],
    material_type: book.material_type_detail?.name ?? '',
    language: book.language_detail?.name ?? '',
  };
};