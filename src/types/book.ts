export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverUrl: string;
  language: string;
  pages: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookFormData extends Omit<Book, 'id' | 'createdAt' | 'updatedAt'> {}