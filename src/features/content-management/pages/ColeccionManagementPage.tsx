import React, { useState } from "react";
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
import { Filter } from "lucide-react";
import { useGetBooksQuery } from "@/features/content-management/api/booksApiSlice";
import { MinimalBook } from "@/features/content-management/api/booksApiSlice";

const BookTable: React.FC = () => {
  const [filters, setFilters] = useState<{
    search?: string;
    author?: string;
    genres__name?: string;
    publication_date?: string;
    material_type?: string;
    language?: string;
  }>({});

  const { data, isFetching } = useGetBooksQuery(filters);

  const handleChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const books = data?.results || [];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Listado de Materiales</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-3" align="end">
            <Input
              placeholder="Buscar título..."
              value={filters.search || ""}
              onChange={(e) => handleChange("search", e.target.value)}
            />
            <Input
              placeholder="Autor"
              value={filters.author || ""}
              onChange={(e) => handleChange("author", e.target.value)}
            />
            <Input
              placeholder="Género"
              value={filters.genres__name || ""}
              onChange={(e) => handleChange("genres__name", e.target.value)}
            />
            <Input
              placeholder="Año de publicación"
              value={filters.publication_date || ""}
              onChange={(e) => handleChange("publication_date", e.target.value)}
            />
            <Select
              value={filters.material_type || ""}
              onValueChange={(val) => handleChange("material_type", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">Libro</SelectItem>
                <SelectItem value="magazine">Revista</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Idioma"
              value={filters.language || ""}
              onChange={(e) => handleChange("language", e.target.value)}
            />
          </PopoverContent>
        </Popover>
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
                  <TableHead>Tipo</TableHead>
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
                        <Badge variant="outline">
                          {book.material_type_detail?.name || "N/A"}
                        </Badge>
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
