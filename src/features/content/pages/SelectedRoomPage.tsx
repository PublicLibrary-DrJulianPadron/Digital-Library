import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetSalaWithGenresQuery } from '@/features/content-management/api/genresApiSlice';
import { AlertCircle, ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { BookCard } from '@/features/content/components/BookCard';
import { ReturnButton } from "@/common/components/ui/return-button";
import { PaginationComponent } from "@/common/components/ui/pagination";

/**
 * Page displaying the selected room with its genres and books.
 * The books are organized horizontally within each genre section.
 */
const SelectedRoomPage = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch genres and books for the specific sala (room)
  const { data: salas, isLoading, isError } = useGetSalaWithGenresQuery({
    page: page,
    page_size: pageSize,
    book_page_size: 10,
    sala: roomName,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-primary font-medium italic">Cargando sala {roomName}...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Error al cargar la sala</h2>
        <p className="text-muted-foreground">Por favor, intente de nuevo más tarde.</p>
        <div className="mt-4">
          <ReturnButton />
        </div>
      </div>
    );
  }

  // Since we filtered by sala, the first element should be our room
  const roomData = salas?.results?.find(s => s.sala === roomName) || (salas?.results && salas.results.length > 0 ? salas.results[0] : null);

  if (!roomData) {
    return (
      <div className="container mx-auto p-8 text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">No se encontró información para la sala {roomName}.</p>
        <div className="mt-4">
          <ReturnButton />
        </div>
      </div>
    );
  }

  const count = salas?.count ?? 0;
  const maxPage = Math.ceil(count / pageSize);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-6xl w-full mx-auto">
      <div className="mb-16 relative">
        <h2 className="text-4xl md:text-4xl font-display italic text-foreground mb-6">
          {roomData.sala}
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-border to-transparent"></div>
        {count > pageSize && (
          <div className="flex justify-center mt-4">
            <PaginationComponent
              currentPage={page}
              maxPage={maxPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <div className="space-y-24">
        {roomData.genres?.map((genre, index) => (
          <section key={genre.slug}>
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-muted">
              <div>
                <span className="block text-[10px] font-mono text-primary mb-2">
                  COLLECTION {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl md:text-1xl font-mono uppercase tracking-widest text-foreground">
                  {genre.label}
                </h3>
              </div>
              <Link
                to={`/catalogo?genero=${genre.slug}`}
                className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                VIEW ALL <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {genre.books?.slice(0, 4).map((book) => (
                <div key={book.id} className="group cursor-pointer">
                  <div className="h-full w-full">
                    <BookCard book={book} />
                  </div>
                </div>
              ))}

              {(!genre.books || genre.books.length === 0) && (
                <div className="col-span-full py-12 border border-dashed border-border rounded flex items-center justify-center">
                  <p className="text-xs font-mono text-muted-foreground italic">
                    No hay libros disponibles en este género — Ghost Grid Active
                  </p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {roomData.genres?.length === 0 && (
        <div className="mt-4 flex items-center justify-center py-8 border border-dashed border-border rounded">
          <p className="text-xs font-mono text-muted-foreground italic">
            No hay géneros asignados a esta sala.
          </p>
        </div>
      )}

      {count > pageSize && (
        <div className="flex justify-center mt-4">
          <PaginationComponent
            currentPage={page}
            maxPage={maxPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SelectedRoomPage;


