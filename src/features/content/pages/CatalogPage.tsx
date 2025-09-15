import { BookList } from '@/features/content/components/BookList';
import { useGetBooksQuery } from '@/features/content-management/api/booksApiSlice';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchLogic } from '@/features/content-management/components/search-logic.tsx';
import { SearchBar } from '@/common/components/ui/searchbar';
import { Button } from '@/common/components/ui/button';
import BookFilters from '@/features/content-management/components/book-filters';
import { PaginationComponent } from '@/common/components/ui/pagination';
import { Popover, PopoverTrigger, PopoverContent } from '@/common/components/ui/popover';
import { Filter } from 'lucide-react';

const DEFAULT_PAGE_SIZE = 5;

const Catalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [filters, setFilters] = useState<{
    search?: string;
    author?: string;
    genres__name?: string;
    publication_date?: string;
    material_type?: string;
    language?: string;
  }>({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const searchLogic = useSearchLogic();
  const {
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    filteredResults,
    handleSearch,
    handleSuggestionClick,
    highlightedIndex,
    setHighlightedIndex,
    isLoading: searchLoading,
    selectedGenreName,
  } = searchLogic;

  // renderizado de sugerencias
  const renderSuggestion = (item: { id: any; title?: string; name?: string; label?: string; type?: string }) => {
    let text = '';
    let type = '';
    if (searchType === 'book' && item.title) {
      text = item.title;
      type = 'Libro';
    } else if (searchType === 'author' && item.name) {
      text = item.name;
      type = 'Autor';
    } else if (searchType === 'genre' && (item.name || item.label)) {
      text = item.label;
      type = 'Genero';
    }

    return (
      <div className="flex flex-col">
        <span className="font-semibold">{text}</span>
        <span className="text-xs text-gray-500">{type}</span>
      </div>
    );
  };

  // query a los libros
  const { data: booksData, isLoading: booksLoading } = useGetBooksQuery({
    ...filters,
    genres__name: selectedGenreName || filters.genres__name,
    page,
    page_size: pageSize,
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value || undefined };
      return newFilters;
    });
    setPage(1); // reset de paginación
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1); // Reset to the first page when page size changes
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

  const books = booksData?.results || [];
  const count = booksData?.count || 0;
  const maxPage = Math.ceil(count / pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        {searchType === 'genre' && selectedGenreName && (
          <h1 className="text-3xl font-bold text-biblioteca-blue mb-6">
            Libros de {selectedGenreName}
          </h1>
        )}
        <div className="mb-6 flex justify-between items-center">
          <SearchBar
            searchType={searchType}
            setSearchType={setSearchType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredResults={filteredResults}
            handleSearch={handleSearch}
            handleSuggestionClick={handleSuggestionClick}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            isLoading={searchLoading}
            renderSuggestion={renderSuggestion}
          />
          <BookFilters filters={filters} onFilterChange={handleFilterChange} pageSize={pageSize} onPageSizeChange={handlePageSizeChange} />
        </div>
        {books.length > 0 ? (
          <>
            <BookList books={books} />
            <PaginationComponent
              currentPage={page}
              maxPage={maxPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-biblioteca-gray text-center">No hay libros disponibles.</div>
        )}
      </main>
    </div>
  );
};

export default Catalog;