import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/common/components/ui/table';
import { Switch } from '@/common/components/ui/switch';
import { Eye, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/common/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/common/components/ui/alert-dialog';
import { useToast } from '@/common/hooks/use-toast';
import { AddUserDialog } from '@/features/users/components/AddUserDialog';

interface Usuario {
  id: string;
  national_document: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  active_loans: number;
  total_books_loaned: number;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  age: number | null;
}

type SortField = 'national_document' | 'active_loans' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function Gestion() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    filterAndSortUsuarios();
  }, [usuarios, searchTerm, sortField, sortOrder]);

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsuarios = () => {
    let filtered = usuarios.filter(usuario =>
      (usuario.national_document?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (usuario.phone || '').includes(searchTerm)
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredUsuarios(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleUsuarioStatus = async (usuarioId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', usuarioId);

      if (error) throw error;

      setUsuarios(usuarios.map(usuario =>
        usuario.id === usuarioId
          ? { ...usuario, is_active: !currentStatus }
          : usuario
      ));

      toast({
        title: 'Usuario actualizado',
        description: `Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`,
      });
    } catch (error) {
      console.error('Error updating usuario:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del usuario',
        variant: 'destructive',
      });
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium flex items-center gap-1"
    >
      {children}
      {sortField === field && (
        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      )}
    </Button>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando usuarios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-biblioteca-blue">Gestión de Usuarios</h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <AddUserDialog onUserAdded={fetchUsuarios} />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                   <TableHead>
                     <SortButton field="national_document">Cédula</SortButton>
                   </TableHead>
                   <TableHead>Teléfono</TableHead>
                   <TableHead>
                     <SortButton field="active_loans">Préstamos Activos</SortButton>
                   </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {filteredUsuarios.map((usuario) => (
                   <TableRow key={usuario.id}>
                     <TableCell className="font-medium">{usuario.national_document || 'N/A'}</TableCell>
                     <TableCell>{usuario.phone || 'N/A'}</TableCell>
                     <TableCell>
                       <Badge variant={(usuario.active_loans || 0) > 0 ? "default" : "secondary"}>
                         {usuario.active_loans || 0}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <Badge variant={usuario.is_active ? "default" : "destructive"}>
                         {usuario.is_active ? "Activo" : "Inactivo"}
                       </Badge>
                     </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/gestion/usuario/${usuario.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog aria-labelledby="dialog-title">
                          <AlertDialogTrigger asChild>
                             <div>
                               <Switch
                                 checked={usuario.is_active}
                                 className="data-[state=checked]:bg-biblioteca-blue"
                               />
                             </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle id="dialog-title">Confirmar cambio de estado</AlertDialogTitle>
                               <AlertDialogDescription>
                                 ¿Está seguro de que desea {usuario.is_active ? 'desactivar' : 'activar'} al usuario con cédula {usuario.national_document || 'N/A'}?
                               </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                               <AlertDialogAction
                                 onClick={() => toggleUsuarioStatus(usuario.id, usuario.is_active)}
                                 className="bg-biblioteca-red hover:bg-biblioteca-red/90"
                               >
                                Confirmar
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
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {filteredUsuarios.map((usuario) => (
          <Card key={usuario.id}>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-semibold text-lg">{usuario.national_document || 'Usuario'}</h3>
                     <p className="text-muted-foreground">Teléfono: {usuario.phone || 'N/A'}</p>
                   </div>
                   <Badge variant={usuario.is_active ? "default" : "destructive"}>
                     {usuario.is_active ? "Activo" : "Inactivo"}
                   </Badge>
                 </div>
                
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <span className="text-sm text-muted-foreground">Préstamos:</span>
                     <Badge variant={(usuario.active_loans || 0) > 0 ? "default" : "secondary"}>
                       {usuario.active_loans || 0}
                     </Badge>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/gestion/usuario/${usuario.id}`)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalles
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <div className="flex items-center gap-2">
                         <span className="text-sm">Estado:</span>
                         <Switch
                           checked={usuario.is_active}
                           className="data-[state=checked]:bg-biblioteca-blue"
                         />
                       </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle id="dialog-title">Confirmar cambio de estado</AlertDialogTitle>
                         <AlertDialogDescription>
                           ¿Está seguro de que desea {usuario.is_active ? 'desactivar' : 'activar'} al usuario con cédula {usuario.national_document || 'N/A'}?
                         </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                         <AlertDialogAction
                           onClick={() => toggleUsuarioStatus(usuario.id, usuario.is_active)}
                           className="bg-biblioteca-red hover:bg-biblioteca-red/90"
                         >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsuarios.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron usuarios con los criterios de búsqueda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}