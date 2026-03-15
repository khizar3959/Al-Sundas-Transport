import React from 'react';
import { 
  Truck, CalendarCheck, CheckCircle2, AlertTriangle, Users, 
  DollarSign, TrendingUp, TrendingDown, Wallet, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const incomeData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
];

const utilizationData = [
  { name: 'Assigned', value: 400 },
  { name: 'Available', value: 300 },
  { name: 'Maintenance', value: 60 },
];

const COLORS = ['#f97316', '#10b981', '#ef4444'];
const EXPENSE_COLORS = ['#3b82f6', '#8b5cf6', '#eab308', '#ec4899'];

const recentRentals = [
  { id: 'RN-1029', equip: 'Bobcat S450', customer: 'Emirates Contracting', status: 'Active', amount: 'AED 1,200' },
  { id: 'RN-1028', equip: 'Excavator 320', customer: 'Dubai Builders', status: 'Pending', amount: 'AED 3,400' },
  { id: 'RN-1027', equip: 'Wheel Loader', customer: 'Al Futtaim', status: 'Completed', amount: 'AED 2,100' },
];

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 dark:bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today Income</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">AED 4,500</h3>
              <p className="text-xs text-emerald-600 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12.5%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Rentals</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">24</h3>
              <p className="text-xs text-emerald-600 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +3 this week</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 shadow-sm">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Available Equipment</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">18</h3>
              <p className="text-xs text-slate-500 mt-1">Out of 45 total</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">In Maintenance</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3</h3>
              <p className="text-xs text-red-500 mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> 1 urgent check</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 shadow-sm animate-pulse duration-2000">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{fill: 'var(--tw-colors-slate-100)', opacity: 0.1}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Income (AED)" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses (AED)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">45</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Rentals</CardTitle>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">View All</button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Equipment</th>
                    <th className="px-4 py-3 text-right rounded-r-lg font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRentals.map((rental, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{rental.id}</td>
                      <td className="px-4 py-4">{rental.customer}</td>
                      <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{rental.equip}</td>
                      <td className="px-4 py-4 text-right">
                        <Badge variant={rental.status === 'Active' ? 'success' : rental.status === 'Pending' ? 'warning' : 'default'}>
                          {rental.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Warning Expiry Alerts Preview */}
        <Card className="border-t-4 border-t-orange-500 xl:col-span-1 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
              <Bell className="w-5 h-5 bg-orange-100 dark:bg-orange-500/20 p-1.5 rounded-md box-content" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <div className="group flex items-start gap-4 p-3.5 rounded-xl bg-orange-50 hover:bg-orange-100/70 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 border border-orange-100 dark:border-orange-500/20 transition-all cursor-pointer">
                 <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                 <div>
                   <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300">Registration Expiring Soon</h4>
                   <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 leading-snug">Wheel Loader (DX-9901) registration expires in 3 days.</p>
                 </div>
               </div>
               
               <div className="group flex items-start gap-4 p-3.5 rounded-xl bg-red-50 hover:bg-red-100/70 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/20 transition-all cursor-pointer">
                 <Users className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                 <div>
                   <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">License Expired</h4>
                   <p className="text-xs text-red-600 dark:text-red-400 mt-1 leading-snug">Operator Ahmed Khan's license expired yesterday.</p>
                 </div>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
