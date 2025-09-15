import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/common/components/ui/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/common/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { Input } from "@/common/components/ui/input";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/common/components/ui/popover";
import { Button } from "@/common/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/common/components/ui/alert-dialog";
import { Filter, Edit, Trash2, Plus } from "lucide-react";
import {
    useGetGenresQuery,
    useDeleteGenreMutation, // Assuming you have this mutation
} from "@/features/content-management/api/genresApiSlice";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/common/components/ui/select";
import { PaginationComponent } from "@/common/components/ui/pagination";

const GenresTable: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [filters, setFilters] = useState<{ search?: string; sala?: string }>({});
    const [pageSize, setPageSize] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const { data: allSalasData } = useGetGenresQuery({ page_size: 1000 });
    const { data: genres, isFetching: isFetchingGenres } = useGetGenresQuery({
        search: filters.search,
        sala: filters.sala,
        page_size: pageSize,
        page: page,
    });
    const [deleteGenre, { isLoading: isDeletingGenre }] = useDeleteGenreMutation();

    const uniqueSalas = allSalasData?.results
        ? Array.from(new Set(allSalasData.results.map((genre) => genre.sala).filter(Boolean))) as string[]
        : [];

    const handleChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
        setPage(1);
    };

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const handleEdit = (genreSlug: string) => {
        navigate(`/gestion/generos/${genreSlug}`);
    };

    const handleDeleteGenre = async (genreSlug: string, genreLabel: string) => {
        try {
            await deleteGenre(genreSlug).unwrap();
            toast({
                title: "Género Eliminado",
                description: `El género "${genreLabel}" ha sido eliminado exitosamente.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un error al eliminar el género.",
                variant: "destructive",
            });
        }
    };

    const handleAdd = () => {
        navigate("/gestion/generos/create");
    };

    const count = genres?.count || 0;
    const maxPage = Math.ceil(count / pageSize);

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Listado de Géneros</CardTitle>
                <div className="flex items-center space-x-2">
                    <Select onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }} value={pageSize.toString()}>
                        <SelectTrigger className="w-[100px] h-9">
                            <SelectValue placeholder="Page Size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
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
                            <Select onValueChange={(value) => handleChange("sala", value === "all" ? "" : value)} value={filters.sala || "all"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Nombre de Sala" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las Salas</SelectItem>
                                    {uniqueSalas.map((sala) => (
                                        <SelectItem key={sala} value={sala}>
                                            {sala}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PopoverContent>
                    </Popover>
                    <Button onClick={handleAdd} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Género
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {isFetchingGenres ? (
                    <div className="text-center text-muted-foreground py-4">Cargando...</div>
                ) : genres?.count === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No se encontraron géneros.
                    </div>
                ) : (
                    <>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre del Género</TableHead>
                                        <TableHead>Sala</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {genres?.results?.map((genre) => (
                                        <TableRow key={genre.id}>
                                            <TableCell className="font-medium">{genre.label}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{genre.sala}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(genre.slug)} // Assuming genre has an 'id'
                                                    className="mr-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" disabled={isDeletingGenre}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. Esto eliminará
                                                                permanentemente el género "{genre.label}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300">
                                                                Cancelar
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 text-white hover:bg-red-600"
                                                                onClick={() => handleDeleteGenre(genre.slug, genre.label)}
                                                            >
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex justify-center mt-4">
                            <PaginationComponent
                                currentPage={page}
                                maxPage={maxPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default GenresTable;