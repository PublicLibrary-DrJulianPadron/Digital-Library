import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { Badge } from "@/common/components/ui/badge";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/common/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/common/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/common/components/ui/popover";
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
import { Filter, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/common/components/ui/use-toast";
import {
  useGetBooksQuery,
  useDeleteBookMutation,
} from "@/features/content-management/api/booksApiSlice";
import { MinimalBook } from "@/features/content-management/api/booksApiSlice";
import { BookForm } from "@/features/content-management/components/BookForm/BookForm";
import BookFilters from "@/features/content-management/components/book-filters";

const BookTable: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState<{
    search?: string;
    author?: string;
    genres__name?: string;
    publication_date?: string;
    material_type?: string;
    language?: string;
  }>({});

  const { data, isFetching } = useGetBooksQuery(filters);
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleEdit = (bookId: string, slug: string) => {
    navigate(`/gestion/libro/${slug}`);
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteBook(slug).unwrap();
      toast({
        title: "Libro Eliminado",
        description: "El libro ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el libro.",
        variant: "destructive",
      });
    }
  };

  const books = data?.results || [];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Listado de Materiales</CardTitle>
        <BookFilters filters={filters} onFilterChange={handleChange} />
      </CardHeader>

      <CardContent>
        {isFetching && (
          <div className="text-center text-muted-foreground py-4">
            Cargando...
          </div>
        )}

        {books.length === 0 && !isFetching ? (
          <div className="text-center text-muted-foreground py-8">
            No se encontraron materiales.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Disponibles</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book: MinimalBook) => {
                  const authors =
                    book.authors
                      ?.filter((a): a is { name: string } => Boolean(a?.name))
                      .map((a) => a.name)
                      .join(", ") || "Sin autor";

                  return (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{authors}</TableCell>
                      <TableCell>{book.publication_date || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            book.quantity_in_stock > 0
                              ? "default"
                              : "destructive"
                          }
                        >
                          {book.quantity_in_stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            book.available_copies > 0
                              ? "default"
                              : "destructive"
                          }
                        >
                          {book.available_copies}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {book.material_type_detail?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(book.id, book.slug)}
                          className="mr-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isDeleting}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará
                                permanentemente este material de la biblioteca.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() => handleDelete(book.slug)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookTable;