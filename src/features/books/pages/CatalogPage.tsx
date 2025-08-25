// src/features/books/pages/Catalog.tsx
import React, { useState } from 'react';
import { BookList } from '@/features/books/components/BookList';
import { BookForm } from '@/features/books/components/BookForm/BookForm';
import { BookSearch } from '@/features/books/components/BookSearch';
import { Button } from '@/common/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/common/components/ui/dialog';
import { Book, useGetBooksQuery, useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation } from '@/features/books/api/booksApiSlice';
import { toast } from '@/common/components/ui/use-toast';

const Catalog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    const { data: books, error, isLoading, isFetching } = useGetBooksQuery({
        search: searchTerm,
        genres__name: selectedGenre,
    });

    const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

    const allGenres = books ? Array.from(new Set(books.flatMap(book => book.genres || []))) : [];

    const handleGenreChange = (value: string) => {
        setSelectedGenre(value === 'all-genres' ? '' : value);
    };

    const handleAddBook = async (bookData: Omit<Book, "id" | "created_at" | "updated_at">) => {
        try {
            await createBook(bookData).unwrap();
            toast({
                title: "Libro agregado",
                description: "El nuevo libro ha sido agregado al catálogo exitosamente.",
            });
            setIsFormOpen(false);
        } catch (err) {
            toast({
                title: "Error",
                description: "No se pudo agregar el libro. Inténtalo de nuevo.",
                variant: "destructive",
            });
        }
    };

    const handleEditBook = async (bookData: Omit<Book, "id" | "created_at" | "updated_at">) => {
        if (!editingBook) return;
        try {
            await updateBook({ id: editingBook.id, body: bookData }).unwrap();
            toast({
                title: "Libro actualizado",
                description: "Los detalles del libro han sido actualizados exitosamente.",
            });
            setEditingBook(null);
            setIsFormOpen(false);
        } catch (err) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el libro. Inténtalo de nuevo.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteBook = async (bookId: string) => {
        try {
            await deleteBook(bookId).unwrap();
            toast({
                title: "Libro eliminado",
                description: "El libro ha sido eliminado del catálogo.",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "No se pudo eliminar el libro. Inténtalo de nuevo.",
                variant: "destructive",
            });
        }
    };

    const openEditForm = (book: Book) => {
        setEditingBook(book);
        setIsFormOpen(true);
    };

    const openAddForm = () => {
        setEditingBook(null);
        setIsFormOpen(true);
    };

    const totalCopies = books?.reduce((sum, book) => sum + (book.quantity_in_stock || 0), 0) || 0;
    const availableCopies = books?.reduce((sum, book) => sum + (book.available_copies || 0), 0) || 0;
    const borrowedCopies = totalCopies - availableCopies;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-xl font-medium text-biblioteca-blue animate-pulse">
                    Cargando libros...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-xl font-medium text-red-500">
                    Error al cargar los libros.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-biblioteca-blue rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-display text-3xl font-bold text-biblioteca-blue">
                                    Gestión de Catálogo
                                </h1>
                                <p className="text-biblioteca-gray">
                                    Administra la colección de libros de la biblioteca
                                </p>
                            </div>
                        </div>

                        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} aria-labelledby="dialog-title">
                            <DialogTrigger asChild>
                                <Button
                                    onClick={openAddForm}
                                    disabled={isCreating}
                                    className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Libro
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-biblioteca-blue font-display text-xl">
                                        {editingBook ? 'Editar Libro' : 'Agregar Nuevo Libro'}
                                    </DialogTitle>
                                </DialogHeader>
                                <BookForm
                                    book={editingBook}
                                    onSubmit={editingBook ? handleEditBook : handleAddBook}
                                    onCancel={() => setIsFormOpen(false)}
                                    isUpdatingBook={!!editingBook}
                                    isSubmitting={isCreating || isUpdating}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Search and Filters */}
                    <BookSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedGenre={selectedGenre || 'all-genres'}
                        onGenreChange={handleGenreChange}
                        genres={allGenres}
                    />

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-biblioteca-blue">{books?.length || 0}</div>
                            <div className="text-sm text-biblioteca-gray">Total de Libros</div>
                        </div>
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-biblioteca-blue">
                                {totalCopies}
                            </div>
                            <div className="text-sm text-biblioteca-gray">Total de Ejemplares</div>
                        </div>
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {availableCopies}
                            </div>
                            <div className="text-sm text-biblioteca-gray">Disponibles</div>
                        </div>
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-biblioteca-red">
                                {borrowedCopies}
                            </div>
                            <div className="text-sm text-biblioteca-gray">En Préstamo</div>
                        </div>
                    </div>
                </div>

                {/* Book List */}
                <BookList
                    books={books as Book[] || []}
                    onEdit={openEditForm}
                    onDelete={handleDeleteBook}
                />
            </div>
        </div>
    );
};

export default Catalog;