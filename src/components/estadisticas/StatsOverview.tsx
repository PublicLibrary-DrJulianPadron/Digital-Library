
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const StatsOverview = () => {
  // Simulate data - in a real app, these would come from your database
  const { data: stats, isLoading } = useQuery({
    queryKey: ['library-stats'],
    queryFn: async () => {
      // Get prestamo sala requests count
      const { data: prestamoData } = await supabase
        .from('solicitudes_prestamo_sala')
        .select('id', { count: 'exact' });

      return {
        activeUsers: 147,
        totalBooks: 2845,
        reservedBooks: 89,
        prestamoRequests: prestamoData?.length || 0
      };
    }
  });

  const overviewCards = [
    {
      title: "Usuarios Activos",
      value: stats?.activeUsers || 0,
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
      description: "Este mes"
    },
    {
      title: "Total de Libros",
      value: stats?.totalBooks || 0,
      icon: BookOpen,
      change: "+5%",
      changeType: "positive" as const,
      description: "En catálogo"
    },
    {
      title: "Libros Reservados",
      value: stats?.reservedBooks || 0,
      icon: Calendar,
      change: "+8%",
      changeType: "positive" as const,
      description: "Actualmente"
    },
    {
      title: "Préstamos de Sala",
      value: stats?.prestamoRequests || 0,
      icon: TrendingUp,
      change: "+15%",
      changeType: "positive" as const,
      description: "Este mes"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-biblioteca-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-biblioteca-blue mb-1">
              {card.value.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={card.changeType === 'positive' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {card.change}
              </Badge>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
