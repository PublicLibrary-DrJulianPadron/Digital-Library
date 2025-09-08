import { BookList } from '@/features/content/components/BookList';
import { useGetBooksByGenreSlugQuery } from '@/features/content-management/api/genresApiSlice';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type PageParams = Record<string, number>;
const DEFAULT_PAGE_SIZE = 5;

const Catalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const genreFromUrl = params.get("genre");

  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string | null>(genreFromUrl);
  const [pageParams, setPageParams] = useState<PageParams>({});

  const booksQueryArg = {
    slug: selectedGenreSlug || undefined,
    page: pageParams[selectedGenreSlug || 'all'] || 1,
    page_size: DEFAULT_PAGE_SIZE,
  };
  const { data: booksData, isLoading: booksLoading } = useGetBooksByGenreSlugQuery(booksQueryArg);

  useEffect(() => {
    setSelectedGenreSlug(genreFromUrl);
  }, [genreFromUrl]);

  useEffect(() => {
    if (selectedGenreSlug) {
      setPageParams((prev) => ({ ...prev, [selectedGenreSlug]: 1 }));
    }
  }, [selectedGenreSlug]);

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

  const handlePageClick = (page: number) => {
    const key = selectedGenreSlug || 'all';
    setPageParams((prev) => ({ ...prev, [key]: page }));
  };

  const renderPageNumbers = (currentPage: number, maxPage: number) => {
    const pages: (number | string)[] = [];
    if (maxPage <= 5) {
      for (let i = 1; i <= maxPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      if (currentPage > 2) pages.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== maxPage) pages.push(currentPage);
      if (currentPage < maxPage - 1) pages.push(currentPage + 1);
      if (currentPage < maxPage - 2) pages.push("...");
      pages.push(maxPage);
    }
    return pages;
  };

  if (booksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-xl font-medium text-biblioteca-blue animate-pulse">
          Cargando libros...
        </div>
      </div>
    );
  }

  if (booksData?.results?.length === 0) {
    return (
      <div className="text-biblioteca-gray text-center mt-8">No hay libros disponibles en este género.</div>
    );
  }

  const key = selectedGenreSlug || 'all';
  const currentPage = pageParams[key] || 1;
  const maxPage = booksData ? Math.ceil((booksData.count || 0) / DEFAULT_PAGE_SIZE) : 1;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        {booksData?.results?.length ? (
          <>
            <BookList books={booksData.results} />
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              {renderPageNumbers(currentPage, maxPage).map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={index}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-1 rounded ${currentPage === page
                      ? "bg-biblioteca-blue text-white font-bold"
                      : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-2 text-biblioteca-gray">
                    {page}
                  </span>
                )
              )}
              <button
                onClick={handleNextPage}
                disabled={currentPage >= maxPage}
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