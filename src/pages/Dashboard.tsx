import { 
  TrendingUp, Calendar, Target, DollarSign, ChevronDown, 
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import clsx from 'clsx';

const revenueData = [
  { name: 'Mon', revenue: 30000 },
  { name: 'Tue', revenue: 55000 },
  { name: 'Wed', revenue: 45000 },
  { name: 'Thu', revenue: 75000 },
  { name: 'Fri', revenue: 65000 },
  { name: 'Sat', revenue: 45000 },
  { name: 'Sun', revenue: 85000 },
];

const fleetCompositionData = [
  { name: 'Sedans', value: 35, color: '#3b82f6' },
  { name: 'SUVs', value: 25, color: '#f59e0b' },
  { name: 'Vans', value: 20, color: '#ef4444' },
  { name: 'Luxury', value: 15, color: '#10b981' },
  { name: 'Trucks', value: 5, color: '#6366f1' },
];

const activeBookings = [
  { id: '#TRG0123', customer: 'Sarah J.', vehicle: 'Toyota RAV4', dates: 'Oct 26-29', status: 'Confirmed' },
  { id: '#TRG0122', customer: 'Sarah J.', vehicle: 'Toyota RAV4', dates: 'Oct 26-29', status: 'Confirmed' },
  { id: '#TRG0124', customer: 'Sarah J.', vehicle: 'Toyota RAV4', dates: 'Oct 26-29', status: 'Confirmed' },
  { id: '#TRG0125', customer: 'Sarah J.', vehicle: 'Toyota RAV4', dates: 'Oct 26-29', status: 'Pending' },
];

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all">
                <Calendar className="w-4 h-4 text-slate-400" />
                Dashboard
                <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Bookings" 
            value="1,845" 
            trend="+12%" 
            isPositive={true} 
            icon={<TrendingUp className="w-4 h-4" />} 
        />
        <StatCard 
            title="Fleet Utilization" 
            value="88%" 
            trend="+5%" 
            isPositive={true} 
            icon={<Target className="w-4 h-4" />} 
        />
        <StatCard 
            title="Revenue" 
            value="USD 495,300" 
            trend="+18%" 
            isPositive={true} 
            icon={<DollarSign className="w-4 h-4" />} 
        />
        <StatCard 
            title="Active Vehicles" 
            value="235/265" 
            isPositive={null} 
            icon={<Info className="w-4 h-4" />} 
            showInfo={true}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Weekly Revenue Trends</CardTitle>
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 transition-all">
                    All Revenue
                    <ChevronDown className="w-3 h-3" />
                </button>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] p-6 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    dy={10} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Fleet Composition</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetCompositionData}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {fleetCompositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
                {fleetCompositionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold">{item.value}%</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Bookings Overview</CardTitle>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400">
                More
                <ChevronDown className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Booking ID</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Customer</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Vehicle</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Dates</th>
                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeBookings.map((booking, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{booking.id}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{booking.customer}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{booking.vehicle}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{booking.dates}</td>
                      <td className="px-6 py-4">
                        <Badge variant={booking.status === 'Confirmed' ? 'success' : 'info'} className="rounded-lg px-3 py-1">
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Availability</CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative h-[300px]">
             {/* Map Placeholder */}
             <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Active Global Tracking</p>
                    <p className="text-xs text-slate-500 mt-1">235 vehicles currently active worldwide</p>
                </div>
                {/* Simulated Pins */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse delay-75"></div>
                <div className="absolute top-1/2 right-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse delay-150"></div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon, showInfo }: { 
    title: string, 
    value: string, 
    trend?: string, 
    isPositive: boolean | null, 
    icon: React.ReactNode,
    showInfo?: boolean
}) {
    return (
        <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
                    {showInfo && <Info className="w-4 h-4 text-slate-300" />}
                    {!showInfo && (
                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                             {icon}
                        </div>
                    )}
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                        {trend && (
                            <div className={clsx(
                                "flex items-center gap-1 mt-1 text-xs font-bold",
                                isPositive ? "text-emerald-500" : "text-red-500"
                            )}>
                                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                {trend}
                            </div>
                        )}
                    </div>
                    {showInfo && (
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                             {icon}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
