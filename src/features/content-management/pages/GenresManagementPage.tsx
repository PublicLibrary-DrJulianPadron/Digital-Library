// src/features/books/pages/GenresManagementPage.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/common/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/common/components/ui/alert-dialog";
import { Badge } from "@/common/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/common/hooks/use-toast";
import { GenreForm } from "@/features/content-management/components/GenreForm/GenreForm";
import { Genre, GenreRequest, useGetGenresQuery, useGetBooksByGenreSlugQuery, useCreateGenreMutation, useUpdateGenreMutation, useDeleteGenreMutation } from '@/features/content-management/api/genresApiSlice';

const GenresManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isGenreFormOpen, setIsGenreFormOpen] = useState(false);
    const [genreToEdit, setGenreToEdit] = useState<Genre | null>(null);
    const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);

    const { toast } = useToast();

    const [selectedGenreSlug, setSelectedGenreSlug] = useState('');
    const { data: genres, isLoading, isFetching, error } = useGetGenresQuery();
    const {
        data: genres_with_books,
        isLoading: isLoadingWithBooks,
        isFetching: isFetchingWithBooks,
        error: errorWithBooks
    } = useGetBooksByGenreSlugQuery(
        { slug: selectedGenreSlug, search: searchTerm },
        { skip: !selectedGenreSlug }
    );

    const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation();
    const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation();
    const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation();

    const handleGenreFormSubmit = async (genreData: GenreRequest) => {
        try {
            if (genreToEdit) {
                await updateGenre({ slug: genreToEdit.slug, data: genreData }).unwrap();
                toast({
                    title: "Género actualizado",
                    description: "Los detalles del género han sido actualizados exitosamente.",
                });
            } else {
                await createGenre(genreData).unwrap();
                toast({
                    title: "Género agregado",
                    description: "El nuevo género ha sido agregado al catálogo exitosamente.",
                });
            }
            setIsGenreFormOpen(false);
            setGenreToEdit(null);
        } catch (err) {
            toast({
                title: "Error",
                description: `No se pudo ${genreToEdit ? 'actualizar' : 'agregar'} el género. Inténtalo de nuevo.`,
                variant: "destructive",
            });
        }
    };

    const handleDeleteGenre = async () => {
        if (genreToDelete) {
            try {
                await deleteGenre(genreToDelete.slug).unwrap();
                toast({
                    title: "Género eliminado",
                    description: "El género ha sido eliminado del catálogo.",
                });
                setGenreToDelete(null);
            } catch (err) {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el género. Inténtalo de nuevo.",
                    variant: "destructive",
                });
            }
        }
    };

    const openDeleteDialog = (genre: Genre) => {
        setGenreToDelete(genre);
    };

    const openAddGenreForm = () => {
        setGenreToEdit(null);
        setIsGenreFormOpen(true);
    };

    const openEditGenreForm = (genre: Genre) => {
        setGenreToEdit(genre);
        setIsGenreFormOpen(true);
    };

    const handleGenreFormCancel = () => {
        setIsGenreFormOpen(false);
        setGenreToEdit(null);
    };

    if (isLoading || isFetching) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-xl font-medium text-red-500">
                    Error al cargar los géneros.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-foreground">Géneros</h1>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="Buscar género..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Dialog open={isGenreFormOpen} onOpenChange={setIsGenreFormOpen} aria-labelledby="add-edit-genre-dialog-title">
                        <DialogTrigger asChild>
                            <Button
                                onClick={openAddGenreForm}
                                className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Género
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle id="add-edit-genre-dialog-title" className="text-biblioteca-blue font-display text-xl">
                                    {genreToEdit ? 'Editar Género' : 'Agregar Nuevo Género'}
                                </DialogTitle>
                            </DialogHeader>
                            <GenreForm
                                genre={genreToEdit}
                                onSubmit={handleGenreFormSubmit}
                                onCancel={handleGenreFormCancel}
                                isSubmitting={isCreating || isUpdating}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre del Género</TableHead>
                                <TableHead>Número de Libros</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {genres?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                        No se encontraron géneros.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                genres_with_books?.map((genres_with_books) => (
                                    <TableRow key={genres_with_books.id}>
                                        <TableCell className="font-medium">{genres_with_books.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {genres_with_books.books?.length || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditGenreForm(genres_with_books)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog open={!!genreToDelete && genreToDelete.id === genres_with_books.id} onOpenChange={(open) => !open && setGenreToDelete(null)}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(genres_with_books)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                ¿Estás seguro de que quieres eliminar el género "{genreToDelete?.name}"? Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDeleteGenre} className="bg-red-600 hover:bg-red-700">
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid gap-4">
                {genres?.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No se encontraron géneros.</p>
                    </div>
                ) : (
                    genres_with_books?.map((genres_with_books) => (
                        <Card key={genres_with_books.id}>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-sm">{genres_with_books.name}</h3>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => openEditGenreForm(genres_with_books)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog open={!!genreToDelete && genreToDelete.id === genres_with_books.id} onOpenChange={(open) => !open && setGenreToDelete(null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(genres_with_books)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            ¿Estás seguro de que quieres eliminar el género "{genreToDelete?.name}"? Esta acción no se puede deshacer.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDeleteGenre} className="bg-red-600 hover:bg-red-700">
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Badge variant="outline">
                                            {genres_with_books.books} libros
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default GenresManagementPage;