import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/common/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/common/components/ui/alert-dialog";
import { Badge } from "@/common/components/ui/badge";
import { Eye, Trash2, Plus, Minus, Edit } from "lucide-react";
import { useToast } from "@/common/hooks/use-toast";
import { BookForm } from "@/features/books/components/BookForm/BookForm";
import { BookRow as Book } from "@/types";

interface BookFormProps {
  book?: Book | null;
  onSave: () => void;
  onCancel: () => void;
}

const Coleccion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLibros, setFilteredLibros] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Kept for future potential quantity changes, though not used in new delete dialog
  const [newQuantity, setNewQuantity] = useState(0); // Kept for future potential quantity changes
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null); // New state for book to delete

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: libros = [], isLoading } = useQuery({
    queryKey: ["libros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("libros")
        .select("*")
        .order("title");

      if (error) throw error;
      return data as Book[];
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, newQuantity }: { id: string; newQuantity: number }) => {
      const { error } = await supabase
        .from("libros")
        .update({ cantidad_existencia: newQuantity })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
      setSelectedBook(null);
      setNewQuantity(0);
      toast({
        title: "Cantidad actualizada",
        description: "La cantidad en existencia ha sido actualizada correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad.",
        variant: "destructive",
      });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("libros")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
      setBookToDelete(null);
      toast({
        title: "Éxito",
        description: "Libro eliminado correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el libro: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (libros) {
      const filtered = libros.filter((libro) =>
        libro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        libro.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (libro.isbn && libro.isbn.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLibros(filtered);
    }
  }, [libros, searchTerm]);

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    if (selectedBook) {
      if (operation === "increase") {
        setNewQuantity(prev => prev + 1);
      } else if (operation === "decrease" && newQuantity > 0) {
        setNewQuantity(prev => prev - 1);
      }
    }
  };

  const handleUpdateQuantity = () => {
    if (selectedBook) {
      updateQuantityMutation.mutate({
        id: selectedBook.id,
        newQuantity: newQuantity,
      });
    }
  };

  const openQuantityDialog = (book: Book) => {
    setSelectedBook(book);
    setNewQuantity(book.quantityInStock);
  };

  const openDeleteDialog = (book: Book) => {
    setBookToDelete(book);
  };

  const handleDeleteBook = () => {
    if (bookToDelete) {
      deleteBookMutation.mutate(bookToDelete.id);
    }
  };

  const openAddBookForm = () => {
    setBookToEdit(null);
    setIsBookFormOpen(true);
  };

  const openEditBookForm = (book: Book) => {
    setBookToEdit(book);
    setIsBookFormOpen(true);
  };

  const handleBookFormSave = () => {
    setIsBookFormOpen(false);
    setBookToEdit(null);
  };

  const handleBookFormCancel = () => {
    setIsBookFormOpen(false);
    setBookToEdit(null);
  };


  if (isLoading) {
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
              <BookForm book={bookToEdit} onSubmit={handleBookFormSave} onCancel={handleBookFormCancel} />
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
              {filteredLibros.map((libro) => (
                <TableRow key={libro.id}>
                  <TableCell className="font-medium">{libro.title}</TableCell>
                  <TableCell>{libro.author}</TableCell>
                  <TableCell>{libro.publicationYear}</TableCell>
                  <TableCell>
                    <Badge variant={libro.quantityInStock > 0 ? "default" : "destructive"}>
                      {libro.quantityInStock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {libro.materialType}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {filteredLibros.map((libro) => (
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
                    {/* --- MODIFIED: Delete Confirmation Dialog (Mobile) --- */}
                    <AlertDialog open={!!bookToDelete && bookToDelete.id === libro.id} onOpenChange={(open) => !open && setBookToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(libro)} // Call the new function
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
                  <p><span className="font-medium">Año:</span> {libro.publicationYear || "N/A"}</p>
                  {libro.isbn && (
                    <p><span className="font-medium">ISBN:</span> {libro.isbn}</p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant={libro.quantityInStock > 0 ? "default" : "destructive"}>
                      {libro.quantityInStock} disponibles
                    </Badge>
                    <Badge variant="outline">
                      {libro.materialType}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLibros.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron materiales.</p>
        </div>
      )}
    </div>
  );
};

export default Coleccion;