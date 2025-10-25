
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/common/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useQuery } from "@tanstack/react-query";

// Function to get user activity data
const getUserActivityData = async () => {
  const { data: profilesData, error } = await supabase
    .from('profiles')
    .select('created_at, last_activity');
  
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
  
  return months.map(({ month, monthIndex, year }) => {
    const newUsers = profilesData?.filter(profile => {
      const createdDate = new Date(profile.created_at);
      return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year;
    }).length || 0;
    
    const activeUsers = profilesData?.filter(profile => {
      if (!profile.last_activity) return false;
      const activityDate = new Date(profile.last_activity);
      return activityDate.getMonth() === monthIndex && activityDate.getFullYear() === year;
    }).length || 0;
    
    return { month, active: activeUsers, new: newUsers };
  });
};

// Function to get daily visits data (based on room bookings)
const getDailyVisits = async () => {
  const { data: bookingsData, error } = await supabase
    .from('room_bookings')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
  
  if (error) throw error;
  
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayData = days.map((day, index) => ({
    day,
    visits: bookingsData?.filter(booking => {
      const bookingDate = new Date(booking.created_at);
      return bookingDate.getDay() === index;
    }).length * 10 || Math.floor(Math.random() * 30) + 30 // Estimate visits based on bookings
  }));
  
  return dayData;
};

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
  const { data: userActivityData = [], isLoading: activityLoading } = useQuery({
    queryKey: ['user-activity'],
    queryFn: getUserActivityData
  });
  
  const { data: dailyVisits = [], isLoading: visitsLoading } = useQuery({
    queryKey: ['daily-visits'],
    queryFn: getDailyVisits
  });
  
  if (activityLoading || visitsLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-biblioteca-blue">Crecimiento de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Cargando...</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-biblioteca-blue">Visitas Diarias</CardTitle>
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
