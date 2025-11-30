
import React, { useState } from 'react';
import { useStore } from '../store';
import { Lock, CheckCircle, Search, Sliders, TrendingUp, Gift, Plus, X, Zap, Star, ShieldCheck } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { marketplaceLeads, buyLead, user, claimFreeLeads, addCredits } = useStore();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  const handleBuyLead = (id: string, cost: number) => {
    if ((user?.credits || 0) < cost) {
      setIsPackageModalOpen(true); // Open packages if low balance
      return;
    }
    const confirm = window.confirm(`Spend ${cost} credits to unlock this lead?`);
    if (confirm) {
      buyLead(id);
    }
  };

  const handleClaimFree = () => {
    claimFreeLeads();
  };

  const handlePurchasePackage = (amount: number, cost: number, packageName: string) => {
    if(window.confirm(`Confirm payment of ₹${cost} for ${packageName}?`)) {
      // Simulate Payment Gateway processing
      setTimeout(() => {
        addCredits(amount);
        setIsPackageModalOpen(false);
      }, 1000);
    }
  };

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 20,
      price: 2000,
      // Light Theme
      bg: 'bg-white',
      border: 'border-gray-200',
      textColor: 'text-slate-900',
      subTextColor: 'text-slate-500',
      iconColor: 'bg-blue-50 text-blue-600',
      btnStyle: 'bg-slate-900 text-white hover:bg-slate-800',
      checkColor: 'text-green-500',
      icon: ShieldCheck,
      popular: false,
      features: ['Valid for 30 days', 'Basic Support']
    },
    {
      id: 'growth',
      name: 'Growth Pack',
      credits: 60,
      price: 5000,
      // Blue Theme
      bg: 'bg-blue-600',
      border: 'border-blue-600',
      textColor: 'text-white',
      subTextColor: 'text-blue-100',
      iconColor: 'bg-white/20 text-white',
      btnStyle: 'bg-white text-blue-600 hover:bg-blue-50',
      checkColor: 'text-blue-200',
      icon: Zap,
      popular: true,
      features: ['Valid for 60 days', 'Priority Support', 'Save ₹1,000']
    },
    {
      id: 'enterprise',
      name: 'Power Pack',
      credits: 150,
      price: 10000,
      // Dark Theme
      bg: 'bg-slate-900',
      border: 'border-slate-900',
      textColor: 'text-white',
      subTextColor: 'text-slate-400',
      iconColor: 'bg-slate-800 text-white',
      btnStyle: 'bg-white text-slate-900 hover:bg-gray-100',
      checkColor: 'text-green-400',
      icon: Star,
      popular: false,
      features: ['No Expiry', 'Dedicated Account Manager', 'Best ROI']
    }
  ];

  return (
    <div className="space-y-6 relative">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="relative z-10">
           <div className="flex justify-between items-start">
             <div>
               <h1 className="text-3xl font-bold mb-2">Premium Lead Marketplace</h1>
               <p className="text-blue-100 mb-6 max-w-xl">Access high-intent leads verified by Housing, MagicBricks, and our internal AI.</p>
             </div>
             <button 
                onClick={() => setIsPackageModalOpen(true)}
                className="bg-white text-blue-800 hover:bg-blue-50 font-bold py-2.5 px-6 rounded-xl shadow-lg flex items-center transform transition hover:scale-105"
             >
                <Plus className="w-5 h-5 mr-2" /> Add Credits
             </button>
           </div>
           
           <div className="flex items-center space-x-4">
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg flex items-center">
               <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
               <span className="font-bold">45 New Leads Today</span>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg flex items-center">
               <span className="text-yellow-400 font-bold mr-2">★</span>
               <span className="font-bold">High Match Score</span>
             </div>
           </div>
        </div>
      </div>

      {/* Claim Free Leads Banner */}
      {!user?.hasClaimedFreeLeads && (
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-md relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
           <div className="flex items-center space-x-4 relative z-10 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Welcome Gift! 🎁</h3>
                <p className="text-orange-50 opacity-90">Get 5 FREE Lead Credits to start your journey.</p>
              </div>
           </div>
           <button 
             onClick={handleClaimFree}
             className="bg-white text-orange-600 font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-orange-50 transition-colors relative z-10 whitespace-nowrap w-full md:w-auto"
           >
             Claim 5 Credits
           </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 sticky top-0 z-10 bg-gray-50 py-2">
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
           <input 
              type="text" 
              placeholder="Search by location (e.g. Bandra, Koramangala)..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
           />
        </div>
        <button className="flex items-center justify-center px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-slate-700 hover:bg-gray-50 shadow-sm">
           <Sliders className="w-4 h-4 mr-2" /> Filters
        </button>
      </div>

      {/* Leads List */}
      <div className="grid gap-4">
        {marketplaceLeads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:border-blue-300 transition-all">
             {/* Left Info */}
             <div className="flex items-start space-x-4 mb-4 md:mb-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  lead.isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'
                }`}>
                   {lead.isLocked ? <Lock className="w-5 h-5" /> : lead.name.charAt(0)}
                </div>
                <div>
                   <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-800 text-lg">
                        {lead.isLocked ? lead.name : lead.name.replace('*', '')}
                      </h3>
                      <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">
                        {lead.matchScore}% MATCH
                      </span>
                   </div>
                   <p className="text-sm text-slate-600 mt-1">
                      Looking for <span className="font-semibold">{lead.requirement}</span> in <span className="font-semibold">{lead.location}</span>
                   </p>
                   <div className="flex items-center mt-2 space-x-3 text-xs text-slate-500">
                      <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">Budget: {lead.budget}</span>
                      <span>Source: {lead.source}</span>
                   </div>
                </div>
             </div>

             {/* Right Action */}
             <div className="flex items-center space-x-4 md:border-l md:border-gray-100 md:pl-6 md:h-16">
                <div className="text-right hidden md:block">
                   <p className="text-xs text-slate-400 font-medium uppercase">Lead Cost</p>
                   <p className="text-lg font-bold text-slate-800">{lead.priceCredits} Credits</p>
                </div>
                {lead.isLocked ? (
                  <button 
                    onClick={() => handleBuyLead(lead.id, lead.priceCredits)}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Unlock Lead
                  </button>
                ) : (
                  <button disabled className="flex-1 md:flex-none bg-green-50 text-green-600 font-semibold py-2.5 px-6 rounded-lg border border-green-200 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" /> Unlocked
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>

      {/* Packages Modal */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Top-up Lead Credits ⚡️</h2>
                <p className="text-slate-500">Purchase credits to unlock premium owner leads instantly.</p>
              </div>
              <button onClick={() => setIsPackageModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pb-4 px-1">
              {packages.map((pkg) => {
                const leadCost = Math.round(pkg.price / pkg.credits);
                
                return (
                  <div 
                    key={pkg.id} 
                    className={`rounded-2xl p-6 relative flex flex-col border-2 transition-all hover:shadow-xl ${pkg.bg} ${pkg.border} ${pkg.popular ? 'transform md:-translate-y-4 shadow-xl ring-4 ring-blue-50' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pkg.iconColor}`}>
                        <pkg.icon className="w-6 h-6" />
                      </div>
                      <h3 className={`text-lg font-bold ${pkg.textColor}`}>{pkg.name}</h3>
                      <div className="flex items-baseline mt-1">
                        <span className={`text-3xl font-bold ${pkg.textColor}`}>₹{pkg.price.toLocaleString()}</span>
                        <span className={`text-sm ml-1 ${pkg.subTextColor}`}>+ GST</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 mb-6">
                       <div className={`flex items-center justify-between p-2 rounded-lg bg-opacity-10 ${pkg.textColor === 'text-white' ? 'bg-white' : 'bg-slate-100'}`}>
                          <span className={`font-bold ${pkg.textColor}`}>{pkg.credits} Credits</span>
                          <span className={`text-xs font-bold ${pkg.textColor} opacity-80`}>₹{leadCost}/lead</span>
                       </div>

                       {pkg.features.map((feature, i) => (
                         <div key={i} className={`flex items-center text-sm ${pkg.subTextColor}`}>
                           <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 ${pkg.checkColor}`} />
                           {feature}
                         </div>
                       ))}
                    </div>

                    <button 
                      onClick={() => handlePurchasePackage(pkg.credits, pkg.price, pkg.name)}
                      className={`w-full py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 ${pkg.btnStyle}`}
                    >
                      Buy Now
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center shrink-0 pt-4 border-t border-gray-100">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Secure Payment via Razorpay. Credits added instantly.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
