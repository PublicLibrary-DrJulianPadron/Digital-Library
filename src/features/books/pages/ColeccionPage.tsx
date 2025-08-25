// src/features/books/pages/Coleccion.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/common/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/common/components/ui/alert-dialog";
import { Badge } from "@/common/components/ui/badge";
import { Eye, Trash2, Plus, Edit } from "lucide-react";
import { useToast } from "@/common/hooks/use-toast";
import { BookForm } from "@/features/books/components/BookForm/BookForm";
import { Book, BookRequest, useGetBooksQuery, useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation } from '@/features/books/api/booksApiSlice';


const Coleccion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const { toast } = useToast();

  const { data: libros, isLoading, isFetching, error } = useGetBooksQuery({ search: searchTerm });
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();


  const handleBookFormSubmit = async (bookData: BookRequest) => {
    try {
      if (bookToEdit) {
        await updateBook({ id: bookToEdit.id, body: bookData }).unwrap();
        toast({
          title: "Libro actualizado",
          description: "Los detalles del libro han sido actualizados exitosamente.",
        });
      } else {
        await createBook(bookData).unwrap();
        toast({
          title: "Libro agregado",
          description: "El nuevo libro ha sido agregado al catálogo exitosamente.",
        });
      }
      setIsBookFormOpen(false);
      setBookToEdit(null);
    } catch (err) {
      toast({
        title: "Error",
        description: `No se pudo ${bookToEdit ? 'actualizar' : 'agregar'} el libro. Inténtalo de nuevo.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBook = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete.id).unwrap();
        toast({
          title: "Libro eliminado",
          description: "El libro ha sido eliminado del catálogo.",
        });
        setBookToDelete(null);
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el libro. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };


  const openDeleteDialog = (book: Book) => {
    setBookToDelete(book);
  };

  const openAddBookForm = () => {
    setBookToEdit(null);
    setIsBookFormOpen(true);
  };

  const openEditBookForm = (book: Book) => {
    setBookToEdit(book);
    setIsBookFormOpen(true);
  };

  const handleBookFormCancel = () => {
    setIsBookFormOpen(false);
    setBookToEdit(null);
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
          Error al cargar los libros.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-foreground">Colección</h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full">
            <Input
              placeholder="Buscar por titulo, autor o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Dialog open={isBookFormOpen} onOpenChange={setIsBookFormOpen} aria-labelledby="add-edit-book-dialog-title">
            <DialogTrigger asChild>
              <Button
                onClick={openAddBookForm}
                className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Libro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle id="add-edit-book-dialog-title" className="text-biblioteca-blue font-display text-xl">
                  {bookToEdit ? 'Editar Libro' : 'Agregar Nuevo Libro'}
                </DialogTitle>
              </DialogHeader>
              <BookForm
                book={bookToEdit}
                onSubmit={handleBookFormSubmit}
                onCancel={handleBookFormCancel}
                isUpdatingBook={!!bookToEdit}
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
                <TableHead>Titulo</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {libros?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron materiales.
                  </TableCell>
                </TableRow>
              ) : (
                libros?.map((libro) => (
                  <TableRow key={libro.id}>
                    <TableCell className="font-medium">{libro.title}</TableCell>
                    <TableCell>{libro.author}</TableCell>
                    <TableCell>{libro.publication_date}</TableCell>
                    <TableCell>
                      <Badge variant={libro.quantity_in_stock > 0 ? "default" : "destructive"}>
                        {libro.quantity_in_stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {libro.material_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditBookForm(libro)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog open={!!bookToDelete && bookToDelete.id === libro.id} onOpenChange={(open) => !open && setBookToDelete(null)}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(libro)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de que quieres eliminar "{bookToDelete?.title}" de la colección? Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteBook} className="bg-red-600 hover:bg-red-700">
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
        {libros?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron materiales.</p>
          </div>
        ) : (
          libros?.map((libro) => (
            <Card key={libro.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">{libro.title}</h3>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditBookForm(libro)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog open={!!bookToDelete && bookToDelete.id === libro.id} onOpenChange={(open) => !open && setBookToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(libro)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres eliminar "{bookToDelete?.title}" de la colección? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteBook} className="bg-red-600 hover:bg-red-700">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium">Autor:</span> {libro.author}</p>
                    <p><span className="font-medium">Año:</span> {libro.publication_date || "N/A"}</p>
                    {libro.isbn && (
                      <p><span className="font-medium">ISBN:</span> {libro.isbn}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant={libro.quantity_in_stock > 0 ? "default" : "destructive"}>
                        {libro.quantity_in_stock} disponibles
                      </Badge>
                      <Badge variant="outline">
                        {libro.material_type}
                      </Badge>
                    </div>
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

export default Coleccion;