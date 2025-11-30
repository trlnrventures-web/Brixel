import React from 'react';
import { LOCALITY_HEATMAP } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Map, TrendingUp, ArrowUpRight } from 'lucide-react';

const Intelligence: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hyper-Local Intelligence 🧠</h1>
        <p className="text-slate-500">Market trends and insights for your target areas.</p>
      </div>

      {/* Top Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700">Top Trending Area</h3>
              <TrendingUp className="text-green-500 w-5 h-5" />
           </div>
           <p className="text-2xl font-bold text-slate-900 mb-1">Kandivali East</p>
           <p className="text-sm text-green-600 font-medium flex items-center">
             <ArrowUpRight className="w-4 h-4 mr-1" /> +12% Demand this week
           </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700">Avg. 2BHK Price</h3>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">Mumbai North</span>
           </div>
           <p className="text-2xl font-bold text-slate-900 mb-1">₹1.45 Cr</p>
           <p className="text-sm text-slate-500">Stable since last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
           <h3 className="font-bold text-indigo-900 mb-2">Smart Tip</h3>
           <p className="text-sm text-indigo-800 leading-relaxed">
             Demand for rental 1BHKs in <strong>Malad</strong> has spiked. Consider calling your investor leads today.
           </p>
           <button className="mt-3 text-xs font-bold text-indigo-600 uppercase hover:underline">View matching leads</button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Demand vs Supply Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Demand vs Supply (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={LOCALITY_HEATMAP}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend />
              <Bar dataKey="demand" name="Buyer Demand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="supply" name="Available Units" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price Trend Line Chart (Mock Data) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Price Trends: 2BHK (Avg)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={[
              { month: 'Jan', price: 1.2 },
              { month: 'Feb', price: 1.25 },
              { month: 'Mar', price: 1.22 },
              { month: 'Apr', price: 1.30 },
              { month: 'May', price: 1.35 },
              { month: 'Jun', price: 1.38 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} domain={[1, 1.5]} tickFormatter={(val) => `₹${val}Cr`} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Simulated Heatmap Visual */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Locality Heatmap</h3>
          <div className="flex space-x-2 text-xs">
            <span className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> High Demand</span>
            <span className="flex items-center"><div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div> Moderate</span>
            <span className="flex items-center"><div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div> Low</span>
          </div>
        </div>
        <div className="relative w-full h-64 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
           {/* Abstract Map Background */}
           <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           
           {/* Heatmap Blobs */}
           <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 rounded-full filter blur-3xl opacity-40"></div>
           <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-yellow-400 rounded-full filter blur-3xl opacity-40"></div>
           <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-400 rounded-full filter blur-3xl opacity-40"></div>

           <div className="z-10 text-slate-500 font-medium flex flex-col items-center">
             <Map className="w-10 h-10 mb-2 text-slate-400" />
             <p>Interactive Map Module Loaded</p>
             <p className="text-xs opacity-70">(Requires Google Maps API Key)</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;