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
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Error al cargar la sala</h2>
                <p className="text-muted-foreground">Por favor, intente de nuevo más tarde.</p>
                <ReturnButton />
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
                <ReturnButton />
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
        <div className="container mx-auto px-4 py-8">
            <header className="mb-12">
                <ReturnButton />
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 m-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight uppercase">
                            {roomData.sala}
                        </h1>
                        <div className="h-1.5 w-24 bg-accent rounded-full"></div>
                    </div>
                </div>
            </header>

            <div className="space-y-16">
                {roomData.genres?.map((genre) => (
                    <section key={genre.slug} className="relative">
                        {/* Genre Label - Rounded box as per sketch */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="bg-card border-2 border-primary rounded-xl px-6 py-2 shadow-sm">
                                <h2 className="text-xl font-bold text-primary uppercase tracking-wider">
                                    {genre.label}
                                </h2>
                            </div>
                            <Link
                                to={`/catalogo?genero=${genre.slug}`}
                                className="text-sm font-semibold text-primary hover:text-accent flex items-center transition-colors"
                            >
                                Ver todo
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Horizontal Scrollable Container */}
                        <div className="relative group">
                            <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
                                {genre.books?.map((book) => (
                                    <div key={book.id} className="flex-none w-[160px] sm:w-[200px] snap-start">
                                        <BookCard book={book} />
                                    </div>
                                ))}
                                {(!genre.books || genre.books.length === 0) && (
                                    <div className="w-full py-12 bg-muted/30 rounded-xl border border-dashed border-border flex items-center justify-center">
                                        <p className="text-muted-foreground italic">No hay libros disponibles en este género</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {roomData.genres?.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Esta sala aún no tiene géneros con libros asignados.</p>
                </div>
            )}

            {count > pageSize && (
                <div className="flex justify-center mt-12 pb-8">
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


