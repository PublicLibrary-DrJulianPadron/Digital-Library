
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/common/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

const userActivityData = [
  { month: "Ene", active: 125, new: 15 },
  { month: "Feb", active: 132, new: 23 },
  { month: "Mar", active: 138, new: 18 },
  { month: "Abr", active: 145, new: 27 },
  { month: "May", active: 142, new: 21 },
  { month: "Jun", active: 147, new: 19 }
];

const dailyVisits = [
  { day: "Lun", visits: 45 },
  { day: "Mar", visits: 52 },
  { day: "Mié", visits: 48 },
  { day: "Jue", visits: 61 },
  { day: "Vie", visits: 73 },
  { day: "Sáb", visits: 68 },
  { day: "Dom", visits: 34 }
];

const chartConfig = {
  active: {
    label: "Usuarios Activos",
    color: "#003366",
  },
  new: {
    label: "Nuevos Usuarios",
    color: "#CC0000",
  },
  visits: {
    label: "Visitas",
    color: "#FFD700",
  },
};

export const UsersChart = () => {
  return (
    <div className="space-y-6">
      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="text-biblioteca-blue">Crecimiento de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="var(--color-active)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-active)" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="var(--color-new)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-new)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Daily Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-biblioteca-blue">Visitas Diarias</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyVisits}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="var(--color-visits)" 
                  fill="var(--color-visits)" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
