// src/features/books/pages/Catalog.tsx
import React from 'react';
import { BookList } from '@/features/content/components/BookList';
import { BookOpen } from 'lucide-react';
import { useGetGenresWithBooksQuery } from '@/features/content-management/api/genresApiSlice';

const Catalog = () => {
  // Fetch all genres with their books
  const { data: genresWithBooks, isLoading, error } = useGetGenresWithBooksQuery({});

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-xl font-medium text-biblioteca-blue animate-pulse">
          Cargando catálogo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-xl font-medium text-red-500">
          Error al cargar el catálogo.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-biblioteca-blue rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-biblioteca-blue">
                Catálogo
              </h1>
              <p className="text-biblioteca-gray">
                Explora la colección de libros organizada por géneros
              </p>
            </div>
          </div>
        </div>

        {/* Genres with Books */}
        <div className="space-y-12">
          {(genresWithBooks ?? []).map((genre) => (
            <section key={genre.slug ?? `genre-${genre.id}`}>
              <h2 className="font-display text-2xl font-semibold text-biblioteca-blue mb-4">
                {genre.name}
              </h2>
              {genre.books?.length ? (
                <BookList books={genre.books} />
              ) : (
                <div className="text-biblioteca-gray">
                  No hay libros disponibles en este género.
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
