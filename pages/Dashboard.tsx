
import React from 'react';
import { Phone, Calendar, Users, TrendingUp, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA } from '../constants';
import { useStore } from '../store';
import { LeadPriority } from '../types';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-xs font-medium text-slate-400 bg-gray-50 px-2 py-1 rounded">Live</span>
    </div>
    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { user, leads } = useStore();
  const navigate = useNavigate();
  
  const hotLeads = leads.filter(l => l.priority === LeadPriority.HOT);
  const siteVisits = leads.filter(l => l.stage === 'Site Visit').length;

  // Calculate Trial Days for Banner
  const getTrialDaysLeft = () => {
    if (!user || user.isSubscribed) return 0;
    const daysPassed = Math.floor((Date.now() - user.trialStart) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - daysPassed);
  };
  const trialDaysLeft = getTrialDaysLeft();

  return (
    <div className="space-y-6">
      {/* Trial Banner */}
      {!user?.isSubscribed && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
             <div className="bg-white/20 p-3 rounded-full animate-pulse">
                <Clock className="w-8 h-8 text-white" />
             </div>
             <div>
                <h3 className="font-bold text-xl">Free Trial Active: <span className="underline decoration-2 underline-offset-4">{trialDaysLeft} Days Left</span></h3>
                <p className="text-sm text-orange-100 opacity-90 max-w-md mt-1">You are currently on the free plan. Upgrade now to keep your leads, access premium market data, and unlock unlimited pipeline features.</p>
             </div>
          </div>
          <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-xl shadow-xl whitespace-nowrap hover:bg-orange-50 transition-transform transform hover:scale-105 w-full md:w-auto">
            Upgrade Plan
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good Morning, {user?.name.split(' ')[0]}! ☀️</h1>
          <p className="text-slate-500">Here is your productivity overview for today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Pipeline" value={leads.length} icon={Users} color="bg-blue-600" />
        <StatCard title="Site Visits" value={siteVisits} icon={Calendar} color="bg-purple-600" />
        <StatCard title="Hot Leads" value={hotLeads.length} icon={TrendingUp} color="bg-orange-500" />
        <StatCard title="Credits Left" value={user?.credits} icon={Phone} color="bg-green-600" />
      </div>

      {/* Main Content Split */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left: Chart & Tasks */}
        <div className="md:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Lead Volume Trend</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Today's Schedule</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline">View Calendar</button>
             </div>
             <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                   <div className="bg-white p-2 rounded-md shadow-sm">
                      <p className="text-xs text-slate-500 font-bold text-center">OCT</p>
                      <p className="text-lg font-bold text-blue-600 text-center">24</p>
                   </div>
                   <div>
                      <h4 className="font-semibold text-slate-900">Site Visit: Oberoi Springs</h4>
                      <p className="text-sm text-slate-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" /> 11:00 AM - with Mr. Sharma
                      </p>
                   </div>
                   <div className="ml-auto">
                      <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded">CONFIRMED</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Hot Leads */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
           <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-slate-900">🔥 Hot Leads</h3>
              <p className="text-sm text-slate-500">Action these immediately</p>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {hotLeads.slice(0, 5).map(lead => (
                <div key={lead.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">{lead.name}</h4>
                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{lead.priority}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{lead.requirement} • {lead.budget}</p>
                  <p className="text-xs text-slate-400 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {lead.location}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                     <a href={`tel:${lead.phone}`} className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-2 rounded hover:bg-blue-100 text-center">Call Now</a>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => navigate('/pipeline')}
                className="w-full py-3 text-sm text-blue-600 font-medium flex items-center justify-center hover:bg-gray-50 rounded-lg"
              >
                 View All Leads <ChevronRight className="w-4 h-4 ml-1" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
