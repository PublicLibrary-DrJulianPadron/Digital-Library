import { BookList } from '@/features/content/components/BookList';
import { useGetSalaWithGenresQuery, useGetBooksByGenreSlugQuery } from '@/features/content-management/api/genresApiSlice';
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
  const [searchType, setSearchType] = useState<"genre" | "author" | "book">("book");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [finalResults, setFinalResults] = useState<any[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);

  const { data: salas, isLoading, error } = useGetSalaWithGenresQuery();

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

  const updateSuggestions = (value: string) => {
    if (!value.trim()) {
      setFilteredResults([]);
      setHighlightedIndex(null);
      return;
    }
    let results: any[] = [];
    if (searchType === "genre" && salas) {
      results = salas.flatMap((sala: any) =>
        sala.genres
          .filter((g: any) =>
            g.label.toLowerCase().includes(value.toLowerCase())
          )
          .map((g: any) => ({
            ...g,
            sala: sala.sala,
          }))
      );
    } else if (searchType === "author" && booksData) {
      results = booksData.results.filter((b: any) =>
        b.author.toLowerCase().includes(value.toLowerCase())
      );
    } else if (searchType === "book" && booksData) {
      results = booksData.results.filter((b: any) =>
        b.title.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredResults(results.slice(0, 5));
    setHighlightedIndex(null);
  };

  const handleSearch = (genreRedirect?: string) => {
    if (searchType === "genre" && genreRedirect) {
      navigate(`/catalogo?genre=${genreRedirect}`);
    } else {
      setFinalResults(filteredResults);
    }
    setFilteredResults([]);
    setHighlightedIndex(null);
    setSearchQuery(""); // limpiar campo de búsqueda
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

  const key = selectedGenreSlug || 'all';
  const currentPage = pageParams[key] || 1;
  const maxPage = booksData ? Math.ceil((booksData.count || 0) / DEFAULT_PAGE_SIZE) : 1;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center gap-4 bg-white shadow px-6 py-4 border-b">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as any)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-biblioteca-blue"
        >
          <option value="genre">Género</option>
          <option value="author">Autor</option>
          <option value="book">Libro</option>
        </select>

        <div className="flex flex-1 gap-2 relative">
          <input
            type="text"
            placeholder={`Buscar por ${searchType === "genre" ? "Género" : searchType === "author" ? "Autor" : "Libro"}`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateSuggestions(e.target.value);
            }}
            onKeyDown={(e) => {
              if (searchType === "genre" && filteredResults.length) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex(prev =>
                    prev === null || prev >= filteredResults.length - 1 ? 0 : prev + 1
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex(prev =>
                    prev === null || prev <= 0 ? filteredResults.length - 1 : prev - 1
                  );
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (highlightedIndex === null) {
                    setHighlightedIndex(0);
                  } else {
                    handleSearch(filteredResults[highlightedIndex].slug);
                  }
                }
              } else if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-biblioteca-blue"
          />
          <button
            onClick={() => {
              if (searchType === "genre" && filteredResults[0]) {
                handleSearch(filteredResults[0].slug);
              } else {
                handleSearch();
              }
            }}
            className="px-4 py-2 bg-biblioteca-blue text-white rounded hover:bg-biblioteca-blue/80"
          >
            Buscar
          </button>

          {searchQuery && filteredResults.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-50 max-h-60 overflow-y-auto">
              {filteredResults.map((item, i) => (
                <li
                  key={i}
                  onClick={() => {
                    if (searchType === "genre") {
                      setSelectedGenreSlug(item.slug);
                      setSearchQuery(item.label);
                      handleSearch(item.slug);
                    } else if (searchType === "author") {
                      setSearchQuery(item.author);
                      handleSearch();
                    } else {
                      setSearchQuery(item.title);
                      handleSearch();
                    }
                  }}
                  className={`p-2 cursor-pointer hover:bg-biblioteca-blue/10 ${highlightedIndex === i ? "bg-biblioteca-blue/20" : ""
                    }`}
                >
                  {searchType === "genre"
                    ? `${item.label} (${item.sala})`
                    : item.title || item.author}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <main className="flex-1 p-6 overflow-y-auto">
        {searching ? (
          <div className="text-center text-biblioteca-gray animate-pulse">Buscando...</div>
        ) : finalResults.length > 0 ? (
          <>
            {searchType === "book" ? (
              <BookList books={finalResults} />
            ) : (
              <ul className="grid gap-2">
                {finalResults.map((item, i) => (
                  <li
                    key={i}
                    className="p-3 bg-white rounded shadow border hover:bg-gray-100 transition"
                  >
                    {searchType === "genre"
                      ? `${item.label} (${item.sala})`
                      : item.name || item.title || item.author}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : booksLoading ? (
          <div className="text-center text-biblioteca-gray animate-pulse">Cargando libros...</div>
        ) : booksData?.results?.length ? (
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
