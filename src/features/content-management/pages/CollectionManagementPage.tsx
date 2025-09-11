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
import { Button } from "@/common/components/ui/button";
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
import { Filter, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/common/components/ui/use-toast";
import {
  useGetBooksQuery,
  useDeleteBookMutation,
} from "@/features/content-management/api/booksApiSlice";
import { MinimalBook } from "@/features/content-management/api/booksApiSlice";
import {
  useGetVideosQuery,
  useDeleteVideoMutation,
} from "@/features/content-management/api/videosApiSlice";
import { MinimalVideo } from "@/features/content-management/api/videosApiSlice";
import BookFilters from "@/features/content-management/components/book-filters";

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeLabel, setActiveLabel] = useState("Libros");
  const [filters, setFilters] = useState<{
    search?: string;
    author?: string;
    genres__name?: string;
    publication_date?: string;
    material_type?: string;
    language?: string;
    director?: string;
    release_date?: string;
    duration?: string;
  }>({});

  const { data: booksData, isFetching: isFetchingBooks } = useGetBooksQuery(
    activeLabel === "Libros" ? filters : undefined,
  );
  const { data: videosData, isFetching: isFetchingVideos } = useGetVideosQuery(
    activeLabel === "Videos" ? filters : undefined,
  );
  const [deleteBook, { isLoading: isDeletingBook }] = useDeleteBookMutation();
  const [deleteVideo, { isLoading: isDeletingVideo }] = useDeleteVideoMutation();

  const handleChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleEdit = (slug: string) => {
    if (activeLabel === "Libros") {
      navigate(`/gestion/libro/${slug}`);
    } else {
      navigate(`/gestion/video/${slug}`);
    }
  };

  const handleDeleteBook = async (slug: string) => {
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

  const handleDeleteVideo = async (slug: string) => {
    try {
      await deleteVideo(slug).unwrap();
      toast({
        title: "Video Eliminado",
        description: "El video ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el video.",
        variant: "destructive",
      });
    }
  };

  const handleAdd = (type: "book" | "video") => {
    if (type === "book") {
      navigate("/gestion/libro/create");
    } else {
      navigate("/gestion/video/create");
    }
  };

  const books = booksData?.results || [];
  const videos = videosData?.results || [];
  const isFetching = isFetchingBooks || isFetchingVideos;
  const isDeleting = isDeletingBook || isDeletingVideo;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Listado de Materiales</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={activeLabel === "Libros" ? "default" : "outline"}
              onClick={() => setActiveLabel("Libros")}
              size="sm"
            >
              Libros
            </Button>
            <Button
              variant={activeLabel === "Videos" ? "default" : "outline"}
              onClick={() => setActiveLabel("Videos")}
              size="sm"
            >
              Videos
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeLabel === "Libros" ? (
            <BookFilters filters={filters} onFilterChange={handleChange} />
          ) : (
            // Add video filters here when available
            <div className="text-sm text-muted-foreground">Filtros de video (próximamente)</div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Añadir
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-auto p-2 min-w-[120px]"
              sideOffset={5}
            >
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  className="justify-end"
                  onClick={() => handleAdd("book")}
                >
                  Añadir Libro
                </Button>
                <Button
                  variant="ghost"
                  className="justify-end"
                  onClick={() => handleAdd("video")}
                >
                  Añadir Video
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent>
        {isFetching && (
          <div className="text-center text-muted-foreground py-4">
            Cargando...
          </div>
        )}

        {!isFetching && activeLabel === "Libros" && books.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No se encontraron materiales.
          </div>
        )}
        {!isFetching && activeLabel === "Videos" && videos.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No se encontraron materiales.
          </div>
        )}

        {activeLabel === "Libros" && books.length > 0 && (
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
                          onClick={() => handleEdit(book.slug)}
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
                                onClick={() => handleDeleteBook(book.slug)}
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

        {activeLabel === "Videos" && videos.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Director</TableHead>
                  <TableHead>Año de Lanzamiento</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video: MinimalVideo) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>{video.director || "N/A"}</TableCell>
                    <TableCell>{video.release_date || "N/A"}</TableCell>
                    <TableCell>{video.duration || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {video.material_type_detail?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(video.slug)}
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
                              onClick={() => handleDeleteVideo(video.slug)}
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
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionPage;