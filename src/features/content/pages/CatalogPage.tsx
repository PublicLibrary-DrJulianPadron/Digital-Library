// src/features/books/pages/Catalog.tsx
import React, { useState, useEffect } from 'react';
import { BookList } from '@/features/content/components/BookList';
import { BookOpen } from 'lucide-react';
import { useGetGenresQuery, useGetGenresWithBooksQuery } from '@/features/content-management/api/genresApiSlice';

const Catalog = () => {
  const { data: genres, isLoading: isLoadingGenres, error: errorGenres } = useGetGenresQuery();
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  useEffect(() => {
    if (genres && genres.count > 0) {
      // Set an initial selection of genres if needed, e.g., the first 3
      setSelectedGenres(genres.slice(0, 3).map((g) => g.id));
    }
  }, [genres]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const genresWithBooksParams = selectedGenres.reduce((acc, id) => {
    acc[id.toString()] = 1;
    return acc;
  }, {} as Record<string, number>);

  const { data: genresWithBooks, isLoading: isLoadingBooks, error: errorBooks } = useGetGenresWithBooksQuery(genresWithBooksParams, {
    skip: selectedGenres.length === 0,
  });

  if (isLoadingGenres) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-xl font-medium text-biblioteca-blue animate-pulse">
          Cargando géneros...
        </div>
      </div>
    );
  }

  if (errorGenres) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-xl font-medium text-red-500">
          Error al cargar los géneros.
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

        {/* Genre Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="font-display text-2xl font-semibold text-biblioteca-blue mb-4">
            Seleccionar Géneros
          </h2>
          <div className="flex flex-wrap gap-4">
            {genres?.results.map((genre) => (
              <label key={genre.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-biblioteca-blue"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                />
                <span className="ml-2 text-biblioteca-gray">{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sections by Genre */}
        <div className="space-y-12">
          {isLoadingBooks ? (
            <div className="text-biblioteca-gray">Cargando libros...</div>
          ) : errorBooks ? (
            <div className="text-red-500">Error al cargar los libros.</div>
          ) : (
            genresWithBooks?.results.map((genre) => (
              <section key={genre.slug}>
                <h2 className="font-display text-2xl font-semibold text-biblioteca-blue mb-4">
                  {genre.name}
                </h2>
                {genre.books && genre.books.length > 0 ? (
                  <BookList books={genre.books} />
                ) : (
                  <div className="text-biblioteca-gray">
                    No hay libros disponibles en este género.
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;