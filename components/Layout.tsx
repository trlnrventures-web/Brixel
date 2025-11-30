
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Kanban, Building2, ShoppingCart, Bell, Plus, X, CreditCard, LogOut, User as UserIcon, Briefcase, ChevronRight, Clock, CheckCircle, AlertCircle, Info, RefreshCcw, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, subscribe, updateProfile, notifications, dismissNotification, resetDemo } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Edit Profile State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editBio, setEditBio] = useState('');

  // Initialize edit form when user data loads or modal opens
  useEffect(() => {
    if (user && isEditProfileOpen) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      setEditCompany(user.companyName || '');
      setEditBio(user.bio || '');
    }
  }, [user, isEditProfileOpen]);

  // Calculate Trial Days Left
  const getTrialDaysLeft = () => {
    if (!user || user.isSubscribed) return 0;
    const daysPassed = Math.floor((Date.now() - user.trialStart) / (1000 * 60 * 60 * 24));
    const left = 7 - daysPassed;
    return Math.max(0, left);
  };
  const trialDaysLeft = getTrialDaysLeft();

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/');
  };

  const openEditProfile = () => {
    setIsEditProfileOpen(true);
    setIsProfileOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editName, editPhone, editCompany, editBio);
    setIsEditProfileOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100';
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pipeline', icon: Kanban, label: 'Pipeline' },
    { path: '/properties', icon: Building2, label: 'Properties' },
    { path: '/marketplace', icon: ShoppingCart, label: 'Buy Leads' },
    { path: '/integrations', icon: LinkIcon, label: 'Integrations' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Notification Toast Container */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-5 fade-in duration-300 ${
              n.type === 'success' ? 'bg-white border-green-100 text-slate-800' :
              n.type === 'error' ? 'bg-white border-red-100 text-slate-800' : 'bg-white border-blue-100 text-slate-800'
            }`}
          >
            <div className={`mr-3 ${
              n.type === 'success' ? 'text-green-500' :
              n.type === 'error' ? 'text-red-500' : 'text-blue-500'
            }`}>
              {n.type === 'success' ? <CheckCircle className="w-5 h-5"/> : 
               n.type === 'error' ? <AlertCircle className="w-5 h-5"/> : <Info className="w-5 h-5"/>}
            </div>
            <p className="text-sm font-medium flex-1">{n.message}</p>
            <button onClick={() => dismissNotification(n.id)} className="ml-2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">PropFlow</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
          
          {/* Trial Counter Desktop */}
          {!user?.isSubscribed && (
            <div className="mt-6 mx-2 p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-12 h-12 bg-orange-200 rounded-full opacity-50 blur-xl"></div>
              <div className="flex items-center text-orange-800 mb-2 relative z-10">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Free Trial</span>
              </div>
              <div className="flex items-baseline mb-1 relative z-10">
                <p className="text-3xl font-bold text-slate-900">{trialDaysLeft}</p>
                <p className="text-sm font-medium text-slate-600 ml-1">days left</p>
              </div>
              <p className="text-[10px] text-slate-500 mb-3 leading-tight relative z-10">Upgrade to Pro to avoid losing access to your leads.</p>
              <button 
                onClick={() => setIsSubModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition-colors relative z-10"
              >
                Upgrade Now
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 relative">
          <div 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
              {user?.avatarInitials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.companyName || user?.role}</p>
            </div>
          </div>

          {/* Desktop Profile Popover */}
          {isProfileOpen && (
            <div className="absolute bottom-20 left-4 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50">
              <button 
                onClick={openEditProfile}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 rounded-lg flex items-center"
              >
                <UserIcon className="w-4 h-4 mr-2" /> Edit Profile
              </button>
              <button 
                onClick={() => { setIsSubModalOpen(true); setIsProfileOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 rounded-lg flex items-center"
              >
                <CreditCard className="w-4 h-4 mr-2" /> Subscription
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
               <button 
                onClick={() => { if(window.confirm("Reset all demo data?")) resetDemo(); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-gray-50 rounded-lg flex items-center"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Reset Demo
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 relative z-30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-800">PropFlow</span>
          </div>
          <div className="flex items-center space-x-4">
             {/* Mobile Trial Badge */}
             {!user?.isSubscribed && (
               <div className="flex flex-col items-end mr-1 cursor-pointer" onClick={() => setIsSubModalOpen(true)}>
                 <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">Trial</span>
                 <span className={`text-xs font-bold ${trialDaysLeft <= 2 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                   {trialDaysLeft} Days Left
                 </span>
               </div>
             )}

            <div className="relative">
               <Bell className="w-6 h-6 text-slate-600" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
            
            {/* Mobile User Button */}
            <div 
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
               {user?.avatarInitials}
            </div>
          </div>

          {/* Mobile Profile Dropdown */}
          {isProfileOpen && (
             <div className="absolute top-16 right-4 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {user?.avatarInitials}
                   </div>
                   <div className="overflow-hidden">
                      <p className="font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.companyName}</p>
                   </div>
                </div>
                <div className="space-y-1">
                  <button 
                    onClick={openEditProfile}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center"><UserIcon className="w-4 h-4 mr-3 text-blue-500" /> Edit Profile</div>
                    <ChevronRight className="w-4 h-4 text-slate-300"/>
                  </button>
                  <button 
                    onClick={() => { setIsSubModalOpen(true); setIsProfileOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center"><CreditCard className="w-4 h-4 mr-3 text-blue-500" /> Subscription</div>
                    <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{user?.credits} CR</div>
                  </button>
                   <button 
                    onClick={() => { if(window.confirm("Reset all demo data?")) resetDemo(); }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-500 hover:bg-gray-50 rounded-lg flex items-center mt-1"
                  >
                    <RefreshCcw className="w-4 h-4 mr-3" /> Reset Demo
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </button>
                </div>
             </div>
          )}
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-8">
           <h2 className="text-lg font-semibold text-slate-800">
             {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
           </h2>
           <div className="flex items-center space-x-6">
              <div 
                className="cursor-pointer flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                onClick={() => setIsSubModalOpen(true)}
              >
                 <span className="text-xs font-bold text-blue-700 mr-1">CR</span>
                 <span className="text-sm font-bold text-blue-900">{user?.credits} Credits</span>
              </div>
              <button className="relative p-2 text-slate-500 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => navigate('/pipeline')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </button>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  location.pathname === item.path ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <item.icon className={`w-6 h-6 ${location.pathname === item.path ? 'fill-current opacity-20' : ''}`} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Subscription Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-6 text-white text-center">
              <h3 className="text-2xl font-bold mb-1">Upgrade to Pro 🚀</h3>
              <p className="text-blue-100">Get unlimited access to PropFlow.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-4 border border-blue-100 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900">Monthly Subscription</p>
                  <p className="text-sm text-slate-500">Full CRM Access</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-blue-600">₹500</p>
                  <p className="text-xs text-slate-400">+GST</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-slate-500 text-center">
                Subscription valid for 30 days from purchase date.
              </div>

              <button 
                onClick={() => { subscribe(); setIsSubModalOpen(false); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all"
              >
                Pay ₹590 Now
              </button>
              <button 
                onClick={() => setIsSubModalOpen(false)}
                className="w-full text-slate-500 font-medium py-2"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <button onClick={() => setIsEditProfileOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Personal Info */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                   <UserIcon className="w-3 h-3 mr-1"/> Personal Details
                 </h4>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Business Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                   <Briefcase className="w-3 h-3 mr-1"/> Business Profile
                 </h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input 
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Dream Homes Realty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Tagline</label>
                  <textarea 
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                    placeholder="e.g. Specialist in South Mumbai Luxury Properties"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 mt-4 shadow-lg shadow-blue-200"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
