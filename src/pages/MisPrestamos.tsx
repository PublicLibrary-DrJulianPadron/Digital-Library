import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Loan {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'PRESTADO' | 'EN ESPERA DE DEVOLUCION' | 'DEVUELTO' | 'EXTRAVIADO';
  libros: {
    nombre: string;
    autor: string;
    isbn?: string;
  };
}

export default function MisPrestamos() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserLoans();
  }, []);

  const fetchUserLoans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('loans')
        .select(`
          id,
          fecha_inicio,
          fecha_fin,
          estado,
          libros (
            nombre,
            autor,
            isbn
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loans:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los préstamos",
          variant: "destructive",
        });
      } else {
        setLoans(data || []);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los préstamos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      'PRESTADO': { variant: 'default' as const, label: 'Prestado' },
      'EN ESPERA DE DEVOLUCION': { variant: 'secondary' as const, label: 'En espera de devolución' },
      'DEVUELTO': { variant: 'outline' as const, label: 'Devuelto' },
      'EXTRAVIADO': { variant: 'destructive' as const, label: 'Extraviado' }
    };

    const config = statusConfig[estado as keyof typeof statusConfig] || statusConfig['PRESTADO'];
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (fechaFin: string, estado: string) => {
    if (estado === 'DEVUELTO') return false;
    return new Date(fechaFin) < new Date();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando préstamos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Préstamos</h1>
            <p className="text-muted-foreground">
              Historial completo de tus préstamos de libros
            </p>
          </div>
        </div>
      </div>

      {loans.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes préstamos</h3>
            <p className="text-muted-foreground">
              Aún no has realizado ningún préstamo de libros.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {loans.map((loan) => (
            <Card key={loan.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground mb-1">
                      {loan.libros.nombre}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      por {loan.libros.autor}
                    </p>
                    {loan.libros.isbn && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ISBN: {loan.libros.isbn}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(loan.estado)}
                    {isOverdue(loan.fecha_fin, loan.estado) && (
                      <Badge variant="destructive" className="text-xs">
                        Vencido
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Fecha de préstamo:</span>
                      <p className="font-medium">{formatDate(loan.fecha_inicio)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Fecha de devolución:</span>
                      <p className={`font-medium ${
                        isOverdue(loan.fecha_fin, loan.estado) 
                          ? 'text-destructive' 
                          : 'text-foreground'
                      }`}>
                        {formatDate(loan.fecha_fin)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}