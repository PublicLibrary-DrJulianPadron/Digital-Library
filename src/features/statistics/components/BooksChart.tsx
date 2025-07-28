
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/common/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Function to get books by category data
const getBooksData = async () => {
  const { data: booksData, error } = await supabase
    .from('books')
    .select('genre, quantityInStock');
  
  if (error) throw error;
  
  // Group books by genre
  const genreCount: Record<string, number> = {};
  booksData?.forEach(book => {
    const genre = book.genre || 'Sin categoría';
    genreCount[genre] = (genreCount[genre] || 0) + (book.quantityInStock || 0);
  });
  
  // Convert to chart data format
  const colors = ["#003366", "#CC0000", "#FFD700", "#666666", "#9966CC", "#33AA33"];
  
  return Object.entries(genreCount).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  }));
};

// Function to get monthly activity data
const getMonthlyData = async () => {
  const { data: loansData, error } = await supabase
    .from('loans')
    .select('created_at, estado, fecha_fin');
  
  if (error) throw error;
  
  // Get last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      month: date.toLocaleDateString('es-ES', { month: 'short' }),
      monthIndex: date.getMonth(),
      year: date.getFullYear()
    });
  }
  
  // Count loans by month
  return months.map(({ month, monthIndex, year }) => {
    const reserved = loansData?.filter(loan => {
      const loanDate = new Date(loan.created_at);
      return loanDate.getMonth() === monthIndex && loanDate.getFullYear() === year;
    }).length || 0;
    
    const returned = loansData?.filter(loan => {
      if (loan.estado !== 'DEVUELTO' || !loan.fecha_fin) return false;
      const returnDate = new Date(loan.fecha_fin);
      return returnDate.getMonth() === monthIndex && returnDate.getFullYear() === year;
    }).length || 0;
    
    return { month, reserved, returned };
  });
};

const chartConfig = {
  reserved: {
    label: "Reservados",
    color: "#003366",
  },
  returned: {
    label: "Devueltos",
    color: "#CC0000",
  },
};

export const BooksChart = () => {
  const { data: booksByCategory = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books-by-category'],
    queryFn: getBooksData
  });
  
  const { data: monthlyData = [], isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthly-activity'],
    queryFn: getMonthlyData
  });
  
  if (booksLoading || monthlyLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-biblioteca-blue">Libros por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Cargando...</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-biblioteca-blue">Actividad Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Cargando...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Books by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-biblioteca-blue">Libros por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={booksByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {booksByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {booksByCategory.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">
                  {category.name}: {category.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-biblioteca-blue">Actividad Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="reserved" fill="var(--color-reserved)" />
                <Bar dataKey="returned" fill="var(--color-returned)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
