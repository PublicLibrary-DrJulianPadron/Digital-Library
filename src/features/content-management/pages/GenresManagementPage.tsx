// src/features/books/pages/GenresTablePage.tsx
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { Input } from "@/common/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/common/components/ui/popover";
import { Button } from "@/common/components/ui/button";
import { Filter } from "lucide-react";
import { useGetGenresQuery, useGetBooksByGenreSlugQuery } from "@/features/content-management/api/genresApiSlice";

const GenresTable: React.FC = () => {
    const [filters, setFilters] = useState<{ search?: string; genre_slug?: string }>({});
    const { data: genres, isFetching: isFetchingGenres } = useGetGenresQuery();
    const [selectedGenreSlug, setSelectedGenreSlug] = useState<string | undefined>(undefined);

    const { data: genresWithBooks, isFetching: isFetchingBooks } = useGetBooksByGenreSlugQuery(
        { slug: selectedGenreSlug || "", search: filters.search },
        { skip: !selectedGenreSlug }
    );

    const handleChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Listado de Géneros</CardTitle>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 space-y-3" align="end">
                        <Input
                            placeholder="Buscar por nombre de género..."
                            value={filters.search || ""}
                            onChange={(e) => handleChange("search", e.target.value)}
                        />
                    </PopoverContent>
                </Popover>
            </CardHeader>

            <CardContent>
                {(isFetchingGenres || isFetchingBooks) && (
                    <div className="text-center text-muted-foreground py-4">Cargando...</div>
                )}

                {genresWithBooks?.count === 0 && !isFetchingBooks ? (
                    <div className="text-center text-muted-foreground py-8">
                        No se encontraron géneros.
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre del Género</TableHead>
                                    <TableHead>Número de Libros</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {genresWithBooks?.map((genre) => (
                                    <TableRow key={genre.id}>
                                        <TableCell className="font-medium">{genre.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{genre.books?.length || 0}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GenresTable;
