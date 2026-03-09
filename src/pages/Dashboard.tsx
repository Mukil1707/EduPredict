import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Search,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, highRiskCount: 0, averagePredictedScore: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/students')
        ]);
        const statsData = await statsRes.json();
        const studentsData = await studentsRes.json();
        setStats(statsData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = students.slice(0, 7).reverse().map(s => ({
    name: s.name.split(' ')[0],
    score: s.predicted_score,
    attendance: s.attendance
  }));

  const statsConfig = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: stats.trends?.total || '0%', up: true },
    { label: 'High Risk Students', value: stats.highRiskCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', trend: stats.trends?.risk || '0%', up: false },
    { label: 'Avg. Predicted Score', value: `${stats.averagePredictedScore}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: stats.trends?.avg || '0%', up: true },
    { label: 'Active Sessions', value: stats.trends?.active || '0', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+18%', up: true },
  ];

  return (
    <div className="p-12 ml-80 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-black tracking-tighter mb-4 gradient-text">
              Performance Dashboard
            </h1>
            <p className="text-slate-500 text-lg font-medium">Welcome back, Admin. Here's your system overview.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3"
          >
            <div className="px-6 py-3 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center gap-3 text-sm font-bold text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </div>
          </motion.div>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statsConfig.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card glass-card-hover p-8 flex flex-col justify-between min-h-[200px] group"
            >
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon size={28} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-amber-500 transition-colors">{stat.label}</h3>
                <p className="text-4xl font-black tracking-tighter text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-card p-10"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-black tracking-tighter text-white mb-1">Performance Trends</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Academic Forecast Analysis</p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-xl bg-slate-950/50 border border-white/5 text-[10px] font-bold text-slate-400">Weekly</div>
                <div className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-bold">Monthly</div>
              </div>
            </div>
            <div className="h-[400px]">
              {students.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                      className="uppercase tracking-widest font-black"
                    />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '20px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                      labelStyle={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '900' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#fbbf24" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-700 uppercase tracking-widest text-xs font-black">
                  No data available. Add students to see trends.
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-10 flex flex-col"
          >
            <h3 className="text-2xl font-black tracking-tighter text-white mb-1">Attendance</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-12">Student Engagement</p>
            <div className="flex-1">
              {students.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={60} className="font-black uppercase tracking-widest" />
                    <Tooltip 
                      cursor={{ fill: '#ffffff05' }}
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '20px' }}
                    />
                    <Bar dataKey="attendance" radius={[0, 10, 10, 0]} barSize={16}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.attendance > 80 ? '#fbbf24' : '#1e293b'} className="transition-all duration-500 hover:opacity-80" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-700 uppercase tracking-widest text-xs font-black">
                  No data available.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-10 border-b border-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-white mb-1">Recent Predictions</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Latest system entries</p>
            </div>
            <Link to="/reports" className="text-xs font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-all hover:tracking-[0.2em]">View All Records</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="px-10 py-6">ID</th>
                  <th className="px-10 py-6">Student Name</th>
                  <th className="px-10 py-6">Attendance</th>
                  <th className="px-10 py-6">Predicted Score</th>
                  <th className="px-10 py-6 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.slice(0, 5).map((student, i) => (
                  <tr key={student.id} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="px-10 py-8 font-mono text-[10px] text-amber-500/60 group-hover:text-amber-400 transition-colors">{student.student_id}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-amber-500 font-black group-hover:scale-110 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-black text-sm text-white group-hover:text-amber-400 transition-colors">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-sm text-slate-400 font-bold">{student.attendance}%</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-32 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.predicted_score}%` }}
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-300" 
                          />
                        </div>
                        <span className="text-sm font-black text-white">{student.predicted_score}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        student.risk_level === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        student.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {student.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
