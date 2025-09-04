// src/features/books/pages/Catalog.tsx
import React, { useState, useMemo } from 'react';
import { BookList } from '@/features/content/components/BookList';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { useGetSalaWithGenresQuery } from '@/features/content-management/api/genresApiSlice';

type PageParams = Record<string, number>;

const DEFAULT_PAGE_SIZE = 5;

const Catalog = () => {
  const [expandedSalas, setExpandedSalas] = useState<Record<string, boolean>>({});
  const [pageParams, setPageParams] = useState<PageParams>({});

  // No need for Object.keys checks
  const { data: salas, isLoading, error } = useGetSalaWithGenresQuery(pageParams || undefined);

  const toggleSala = (salaName: string) => {
    setExpandedSalas((prev) => ({
      ...prev,
      [salaName]: !prev[salaName],
    }));
  };

  const handleNextPage = (genreId: string, totalBooks: number) => {
    const currentPage = pageParams[`page_${genreId}`] || 1;
    const nextPage = currentPage + 1;
    const maxPage = Math.ceil(totalBooks / (pageParams[`page_size_${genreId}`] || DEFAULT_PAGE_SIZE));

    if (nextPage <= maxPage) {
      setPageParams((prev) => ({
        ...prev,
        [`page_${genreId}`]: nextPage,
      }));
    }
  };

  const handlePrevPage = (genreId: string) => {
    const currentPage = pageParams[`page_${genreId}`] || 1;
    if (currentPage > 1) {
      setPageParams((prev) => ({
        ...prev,
        [`page_${genreId}`]: currentPage - 1,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-xl font-medium text-biblioteca-blue animate-pulse">
          Cargando salas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-xl font-medium text-red-500">
          Error al cargar las salas.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="font-display text-xl font-bold text-biblioteca-blue mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Catálogo
        </h2>

        <nav className="space-y-2">
          {salas?.map((sala) => (
            <div key={sala.sala}>
              <button
                onClick={() => toggleSala(sala.sala)}
                className="flex items-center w-full justify-between text-biblioteca-gray hover:text-biblioteca-blue font-medium"
              >
                <span>{sala.sala}</span>
                {expandedSalas[sala.sala] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedSalas[sala.sala] && (
                <ul className="pl-4 mt-1 space-y-1">
                  {sala.genres.map((genre) => (
                    <li key={genre.code} className="text-biblioteca-gray hover:text-biblioteca-blue cursor-pointer">
                      {genre.code} - {genre.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {salas?.map((sala) =>
          expandedSalas[sala.sala] ? (
            <section key={sala.sala} className="mb-12">
              <h3 className="font-display text-2xl font-semibold text-biblioteca-blue mb-4">
                {sala.sala}
              </h3>

              {sala.genres.map((genre) => (
                <div key={genre.code} className="mb-6">
                  <h4 className="font-medium text-biblioteca-gray mb-2">
                    {genre.code} - {genre.label}
                  </h4>

                  {genre.books.length > 0 ? (
                    <>
                      <BookList books={genre.books} />

                      {/* Pagination controls */}
                      {genre.books_count > DEFAULT_PAGE_SIZE && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handlePrevPage(genre.code)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            disabled={(pageParams[`page_${genre.code}`] || 1) <= 1}
                          >
                            Anterior
                          </button>
                          <button
                            onClick={() => handleNextPage(genre.code, genre.books_count)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            disabled={
                              (pageParams[`page_${genre.code}`] || 1) >=
                              Math.ceil(genre.books_count / (pageParams[`page_size_${genre.code}`] || DEFAULT_PAGE_SIZE))
                            }
                          >
                            Siguiente
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-biblioteca-gray">No hay libros disponibles.</div>
                  )}
                </div>
              ))}
            </section>
          ) : null
        )}
      </main>
    </div>
  );
};

export default Catalog;
