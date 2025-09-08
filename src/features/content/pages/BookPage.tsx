import { useParams, useNavigate } from "react-router-dom";
import { useGetBookBySlugQuery } from "@/features/content-management/api/booksApiSlice";
import type { components } from "@/common/types/generated-api-types";
import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { ReturnButton } from "@/common/components/ui/return-button";
import { Separator } from "@/common/components/ui/separator";
import { AspectRatio } from "@/common/components/ui/aspect-ratio";

export type Book = components['schemas']['Book'];

const BookPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const { data: book, isLoading, error } = useGetBookBySlugQuery(slug!);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-xl font-medium text-biblioteca-blue animate-pulse">
                    Cargando libro...
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-xl font-medium text-red-500">
                    {book ? "Error al cargar el libro." : "Libro no encontrado."}
                </div>
            </div>
        );
    }

    const authorCount = book.authors_detail?.length;
    const authorLabel = authorCount && authorCount > 1 ? "Autores:" : "Autor:";

    return (
        <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <ReturnButton/>
            {/* The main content now uses a grid layout with a specific column and row configuration. */}
            <div className="grid gap-6 mt-4 md:grid-cols-[1fr_2fr] md:grid-rows-[min-content_1fr]">
                {/* Book Cover */}
                {/* On larger screens, the cover and title are on the same row. On smaller screens, they stack vertically. */}
                <div className="flex justify-center md:col-span-1 md:row-span-1 rounded-lg bg-glass px-2">
                    <div className="w-48 sm:w-64">
                        <AspectRatio ratio={2 / 3}>
                            <img
                                src={book.cover}
                                alt={`Portada de ${book.title}`}
                                className="h-full w-full rounded-md object-contain"
                            />
                        </AspectRatio>
                    </div>
                </div>

                {/* Title and Synopsis Panel */}
                <div className="flex-grow grid gap-2 rounded-lg bg-white p-4 shadow-lg md:col-span-1">
                    {/* Title */}
                    <div className="flex items-start justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            {book.title}
                        </h1>
                    </div>

                    {/* Author(s) */}
                    {book.authors_detail && book.authors_detail.length > 0 && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">{authorLabel}</span>{" "}
                            {book.authors_detail.map((a) => a.name).join(", ")}
                        </div>
                    )}

                    {/* Number of Pages */}
                    {book.pages && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">Páginas:</span>{" "}
                            {book.pages}
                        </div>
                    )}

                    {/* Meta Info and Rating */}
                    {book.language_detail && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">Idioma:</span>{" "}
                            {book.language_detail.name}
                        </div>
                    )}

                    {book.isbn && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">ISBN:</span>{" "}
                            {book.isbn}
                        </div>
                    )}

                    {book.publication_date && (
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">Fecha de Publicación:</span>{" "}
                            {book.publication_date}
                        </div>
                    )}

                    {/* Genres as Badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {book.genres_detail?.map((genre) => (
                            <Badge key={genre.id} variant="secondary" className="px-3 py-1">
                                {genre.label}
                            </Badge>
                        ))}
                    </div>

                    <Separator />

                    {/* Synopsis */}
                    <div className="grid gap-2">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Sinopsis
                        </h2>
                        <p className="text-sm text-gray-700">
                            {book.description || "—"}
                        </p>
                    </div>
                </div>

                {/* Key Details Panel */}
                {/* This section now spans both columns on the second row on larger screens. */}
                <div className="flex-grow grid gap-4 rounded-lg bg-white p-4 shadow-lg md:col-span-2 md:row-start-2">
                    {/* Key Details */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                        <div>
                            <span className="font-semibold text-gray-800">Editorial:</span>{" "}
                            <span className="text-gray-700">{book.publisher || "—"}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Material:</span>{" "}
                            <span className="text-gray-700">
                                {book.material_type_detail?.name || "—"}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Copias disponibles:</span>{" "}
                            <span className="text-gray-700">
                                {book.available_copies ?? "—"}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Total en stock:</span>{" "}
                            <span className="text-gray-700">
                                {book.quantity_in_stock ?? "—"}
                            </span>
                        </div>
                    </div>

                    {/* Digital File Link */}
                    {book.digital_file && (
                        <div className="mt-4">
                            <a
                                href={book.digital_file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-biblioteca-blue underline"
                            >
                                Descargar archivo digital
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookPage;