import React, { useState, useEffect } from 'react';
import { BookList } from '@/features/content/components/BookList';
import { BookOpen, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useGetSalaWithGenresQuery, useGetBooksByGenreSlugQuery } from '@/features/content-management/api/genresApiSlice';

type PageParams = Record<string, number>;

const DEFAULT_PAGE_SIZE = 5;

const Catalog = () => {
  const [expandedSalas, setExpandedSalas] = useState<Record<string, boolean>>({});
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string | null>(null);
  const [pageParams, setPageParams] = useState<PageParams>({});

  const { data: salas, isLoading, error } = useGetSalaWithGenresQuery();

  // Fetch books globally or by selected genre
  const booksQueryArg = {
    slug: selectedGenreSlug || undefined, // undefined = fetch all
    page: pageParams[selectedGenreSlug || 'all'] || 1,
    page_size: DEFAULT_PAGE_SIZE,
  };
  const { data: booksData, isLoading: booksLoading } = useGetBooksByGenreSlugQuery(booksQueryArg);

  // Reset page to 1 whenever a new genre is selected
  useEffect(() => {
    if (selectedGenreSlug) {
      setPageParams((prev) => ({ ...prev, [selectedGenreSlug]: 1 }));
    }
  }, [selectedGenreSlug]);

  const toggleSala = (salaName: string) => {
    setExpandedSalas((prev) => ({
      ...prev,
      [salaName]: !prev[salaName],
    }));
  };

  const handleNextPage = () => {
    const key = selectedGenreSlug || 'all';
    const currentPage = pageParams[key] || 1;
    const maxPage = booksData ? Math.ceil(booksData.count / DEFAULT_PAGE_SIZE) : 1;
    if (currentPage < maxPage) {
      setPageParams((prev) => ({ ...prev, [key]: currentPage + 1 }));
    }
  };

  const handlePrevPage = () => {
    const key = selectedGenreSlug || 'all';
    const currentPage = pageParams[key] || 1;
    if (currentPage > 1) {
      setPageParams((prev) => ({ ...prev, [key]: currentPage - 1 }));
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
        <h2 className="font-display text-xl font-bold text-biblioteca-blue mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Catálogo
          </div>
          {selectedGenreSlug && (
            <button
              onClick={() => setSelectedGenreSlug(null)}
              className="text-red-500 font-bold ml-2 hover:text-red-700"
              title="Limpiar genero Seleccionado"
            >
              <X className="w-4 h-4 text-red-500 hover:text-red-700" />
            </button>
          )}
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
                    <li
                      key={genre.slug}
                      className={`cursor-pointer ${selectedGenreSlug === genre.slug
                        ? 'text-biblioteca-blue font-semibold'
                        : 'text-biblioteca-gray hover:text-biblioteca-blue'
                        }`}
                      onClick={() => setSelectedGenreSlug(genre.slug)}
                    >
                      {genre.label}
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
        {booksLoading ? (
          <div className="text-center text-biblioteca-gray animate-pulse">Cargando libros...</div>
        ) : booksData?.results?.length ? (
          <>
            <BookList books={booksData.results} />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={(pageParams[selectedGenreSlug || 'all'] || 1) <= 1}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={
                  (pageParams[selectedGenreSlug || 'all'] || 1) >=
                  Math.ceil((booksData.count || 0) / DEFAULT_PAGE_SIZE)
                }
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <div className="text-biblioteca-gray text-center">No hay libros disponibles.</div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
