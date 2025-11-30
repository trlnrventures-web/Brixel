
import React, { useState } from 'react';
import { useStore } from '../store';
import { Facebook, Chrome, Home, Building2, ShoppingBag, Webhook, Key, Check, AlertCircle, Copy, ExternalLink, X, BrickWall } from 'lucide-react';
import { Integration } from '../types';

const Integrations: React.FC = () => {
  const { integrations, toggleIntegration } = useStore();
  const [selectedInt, setSelectedInt] = useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Helper to render icons dynamically
  const getIcon = (name: string) => {
    switch(name) {
      case 'Facebook': return <Facebook className="w-6 h-6 text-blue-600" />;
      case 'Chrome': return <Chrome className="w-6 h-6 text-red-500" />;
      case 'Home': return <Home className="w-6 h-6 text-purple-600" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-blue-800" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-orange-500" />;
      case 'Webhook': return <Webhook className="w-6 h-6 text-slate-600" />;
      case 'BrickWall': return <BrickWall className="w-6 h-6 text-red-600" />;
      default: return <Webhook className="w-6 h-6 text-slate-500" />;
    }
  };

  const handleConnectClick = (integration: Integration) => {
    if (integration.isConnected) {
       if(window.confirm(`Are you sure you want to disconnect ${integration.name}? Incoming leads will stop syncing.`)) {
         toggleIntegration(integration.id);
       }
    } else {
      // Open Modal
      setSelectedInt(integration);
      setApiKeyInput('');
    }
  };

  const handleConfirmConnect = () => {
    if (!selectedInt) return;
    setIsConnecting(true);
    
    // Simulate API delay
    setTimeout(() => {
       toggleIntegration(selectedInt.id, apiKeyInput);
       setIsConnecting(false);
       setSelectedInt(null);
    }, 1500);
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText('https://api.propflow.crm/v1/hooks/u1');
    alert('Webhook URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Integrations Hub</h1>
          <p className="text-slate-300 max-w-xl">
            Connect your lead sources and automatically sync inquiries into your pipeline. 
            We support all major Indian real estate platforms.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12"></div>
      </div>

      {/* Active Integrations Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-xs text-slate-500 font-bold uppercase">Active Sources</p>
               <p className="text-2xl font-bold text-slate-900">{integrations.filter(i => i.isConnected).length}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg"><Check className="w-5 h-5 text-green-600" /></div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-xs text-slate-500 font-bold uppercase">Last Sync</p>
               <p className="text-lg font-bold text-slate-900">2 mins ago</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg"><Webhook className="w-5 h-5 text-blue-600" /></div>
         </div>
      </div>

      {/* Webhook Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
         <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Webhook className="w-5 h-5 mr-2 text-slate-700" /> Universal Webhook
              </h3>
              <p className="text-sm text-slate-500">Use this URL to push leads from your own website, WordPress, or landing pages.</p>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
               Docs <ExternalLink className="w-3 h-3 ml-1" />
            </button>
         </div>
         <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <code className="text-xs md:text-sm font-mono text-slate-600 flex-1 break-all">https://api.propflow.crm/v1/hooks/u1_sec_8823</code>
            <button onClick={copyWebhook} className="p-2 hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-all">
              <Copy className="w-4 h-4 text-slate-500" />
            </button>
         </div>
      </div>

      {/* Integrations Grid */}
      <h3 className="text-lg font-bold text-slate-900 pt-2">Available Connections</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.filter(i => i.provider !== 'webhook').map(integration => (
          <div key={integration.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  {getIcon(integration.icon)}
                </div>
                {integration.isConnected ? (
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Connected
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">
                    Not Connected
                  </span>
                )}
             </div>
             
             <h4 className="font-bold text-slate-900 mb-1">{integration.name}</h4>
             <p className="text-sm text-slate-500 mb-6 flex-1">{integration.description}</p>

             <button 
               onClick={() => handleConnectClick(integration)}
               className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                 integration.isConnected 
                  ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
               }`}
             >
               {integration.isConnected ? 'Disconnect' : 'Connect'}
             </button>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {selectedInt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 scale-100 transform transition-all">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">{getIcon(selectedInt.icon)}</div>
                    <h3 className="text-xl font-bold text-slate-900">Connect {selectedInt.name}</h3>
                 </div>
                 <button onClick={() => setSelectedInt(null)} className="p-1 hover:bg-gray-100 rounded-full">
                   <X className="w-5 h-5 text-slate-400" />
                 </button>
              </div>

              <div className="space-y-4">
                 {selectedInt.provider === 'meta' || selectedInt.provider === 'google' ? (
                   <div className="text-center py-6">
                      <p className="text-slate-600 mb-4">You will be redirected to {selectedInt.name} to authorize PropFlow.</p>
                      {isConnecting ? (
                         <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Authenticating...</span>
                         </div>
                      ) : (
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                           <AlertCircle className="w-4 h-4 inline mr-2" />
                           Pop-up window will open.
                        </div>
                      )}
                   </div>
                 ) : (
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">
                        Enter API Key / CRM ID
                     </label>
                     <div className="relative">
                        <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                           type="text" 
                           value={apiKeyInput}
                           onChange={(e) => setApiKeyInput(e.target.value)}
                           placeholder={`Paste your ${selectedInt.name} Key`}
                           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        />
                     </div>
                     <p className="text-xs text-slate-400 mt-2">
                       You can find this in your {selectedInt.name} Settings {'>'} Developer / API.
                     </p>
                   </div>
                 )}

                 <button 
                   onClick={handleConfirmConnect}
                   disabled={isConnecting}
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 mt-2 disabled:opacity-70"
                 >
                   {isConnecting ? 'Connecting...' : 'Save & Connect'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;