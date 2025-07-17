import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Libro {
  id: string;
  nombre: string;
  autor: string;
  isbn: string | null;
  ano_publicacion: number | null;
  cantidad_existencia: number;
  tipo_material: string;
}

const Coleccion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLibros, setFilteredLibros] = useState<Libro[]>([]);
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: libros = [], isLoading } = useQuery({
    queryKey: ["libros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("libros")
        .select("*")
        .order("nombre");
      
      if (error) throw error;
      return data as Libro[];
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

  useEffect(() => {
    if (libros) {
      const filtered = libros.filter((libro) =>
        libro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const openQuantityDialog = (book: Libro) => {
    setSelectedBook(book);
    setNewQuantity(book.cantidad_existencia);
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
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, autor o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
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
                  <TableCell className="font-medium">{libro.nombre}</TableCell>
                  <TableCell>{libro.autor}</TableCell>
                  <TableCell>{libro.ano_publicacion || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={libro.cantidad_existencia > 0 ? "default" : "destructive"}>
                      {libro.cantidad_existencia}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {libro.tipo_material}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openQuantityDialog(libro)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modificar Cantidad</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Cantidad actual de "{selectedBook?.nombre}": {selectedBook?.cantidad_existencia}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange("decrease")}
                                disabled={newQuantity <= 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                                className="w-20 text-center"
                                min="0"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange("increase")}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex justify-end gap-2">
                              <DialogTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogTrigger>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button>Aceptar</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar cambio</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      ¿Estás seguro de que quieres cambiar la cantidad de "{selectedBook?.nombre}" a {newQuantity}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleUpdateQuantity}>
                                      Aceptar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                  <h3 className="font-semibold text-sm">{libro.nombre}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openQuantityDialog(libro)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modificar Cantidad</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Cantidad actual de "{selectedBook?.nombre}": {selectedBook?.cantidad_existencia}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange("decrease")}
                              disabled={newQuantity <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={newQuantity}
                              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                              min="0"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange("increase")}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex justify-end gap-2">
                            <DialogTrigger asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogTrigger>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button>Aceptar</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar cambio</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Estás seguro de que quieres cambiar la cantidad de "{selectedBook?.nombre}" a {newQuantity}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleUpdateQuantity}>
                                    Aceptar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Autor:</span> {libro.autor}</p>
                  <p><span className="font-medium">Año:</span> {libro.ano_publicacion || "N/A"}</p>
                  {libro.isbn && (
                    <p><span className="font-medium">ISBN:</span> {libro.isbn}</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant={libro.cantidad_existencia > 0 ? "default" : "destructive"}>
                      {libro.cantidad_existencia} disponibles
                    </Badge>
                    <Badge variant="outline">
                      {libro.tipo_material}
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