
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const booksByCategory = [
  { name: "Literatura", value: 485, color: "#003366" },
  { name: "Historia", value: 320, color: "#CC0000" },
  { name: "Ciencias", value: 280, color: "#FFD700" },
  { name: "Arte", value: 210, color: "#666666" },
  { name: "Filosofía", value: 180, color: "#9966CC" },
  { name: "Tecnología", value: 165, color: "#33AA33" }
];

const monthlyData = [
  { month: "Ene", reserved: 65, returned: 58 },
  { month: "Feb", reserved: 78, returned: 72 },
  { month: "Mar", reserved: 84, returned: 79 },
  { month: "Abr", reserved: 91, returned: 86 },
  { month: "May", reserved: 89, returned: 84 },
  { month: "Jun", reserved: 95, returned: 89 }
];

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
