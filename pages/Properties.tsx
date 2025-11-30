import React, { useState } from 'react';
import { useStore } from '../store';
import { PropertyStatus, PropertyCategory, PropertyType, Property } from '../types';
import { MapPin, BedDouble, Ruler, Filter, Download, Share2, Plus, X } from 'lucide-react';

const Properties: React.FC = () => {
  const { properties, addProperty } = useStore();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // New Property State
  const [newProp, setNewProp] = useState<Partial<Property>>({
    category: PropertyCategory.RESALE,
    type: PropertyType.FLAT,
    status: PropertyStatus.AVAILABLE
  });

  const filteredProperties = filterCategory === 'All' 
    ? properties 
    : properties.filter(p => p.category === filterCategory);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const property: Property = {
      id: `P${Date.now()}`,
      title: newProp.title || 'New Listing',
      price: newProp.price || 'Price on Request',
      location: newProp.location || '',
      category: newProp.category as PropertyCategory,
      type: newProp.type as PropertyType,
      bhk: newProp.bhk,
      areaSqFt: newProp.areaSqFt || 0,
      status: newProp.status as PropertyStatus,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      ownerName: newProp.ownerName || 'Self',
      ownerPhone: newProp.ownerPhone || ''
    };
    addProperty(property);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
        <div className="flex items-center space-x-3 w-full md:w-auto">
           <div className="flex-1 md:flex-none bg-white border border-gray-200 rounded-lg p-1 shadow-sm flex overflow-x-auto">
            {['All', PropertyCategory.NEW, PropertyCategory.RESALE, PropertyCategory.RENTAL].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                  filterCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
              <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                {property.type}
              </div>
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                property.category === PropertyCategory.RENTAL ? 'bg-purple-500' : 
                property.category === PropertyCategory.NEW ? 'bg-blue-500' : 'bg-orange-500'
              }`}>
                {property.category}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{property.price}</h3>
                <button className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-slate-600 text-sm font-medium mb-1 truncate">{property.title}</p>
              
              <div className="flex items-center text-slate-500 text-xs mb-4">
                <MapPin className="w-3 h-3 mr-1" />
                {property.location}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {property.bhk && (
                  <div className="bg-gray-50 rounded px-3 py-2 flex items-center text-xs text-slate-600 font-medium">
                    <BedDouble className="w-3.5 h-3.5 mr-2 text-blue-500" />
                    {property.bhk} BHK
                  </div>
                )}
                <div className="bg-gray-50 rounded px-3 py-2 flex items-center text-xs text-slate-600 font-medium">
                  <Ruler className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  {property.areaSqFt} sq.ft
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                   <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700">
                      {property.ownerName.charAt(0)}
                   </div>
                   <span className="text-xs text-slate-500 font-medium">Owner: {property.ownerName}</span>
                </div>
                <button className="text-blue-600 text-xs font-bold flex items-center hover:underline">
                  <Download className="w-3 h-3 mr-1" /> Brochure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">List Property</h3>
              <button onClick={() => setIsAddOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddProperty} className="space-y-4">
              <input required placeholder="Property Title" className="w-full p-2 border rounded" onChange={e => setNewProp({...newProp, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Price (e.g. 1.2 Cr)" className="w-full p-2 border rounded" onChange={e => setNewProp({...newProp, price: e.target.value})} />
                <input required placeholder="Area (Sq.ft)" type="number" className="w-full p-2 border rounded" onChange={e => setNewProp({...newProp, areaSqFt: Number(e.target.value)})} />
              </div>
              <input required placeholder="Location" className="w-full p-2 border rounded" onChange={e => setNewProp({...newProp, location: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select className="p-2 border rounded" onChange={e => setNewProp({...newProp, category: e.target.value as PropertyCategory})}>
                  <option value={PropertyCategory.RESALE}>Resale</option>
                  <option value={PropertyCategory.RENTAL}>Rental</option>
                  <option value={PropertyCategory.NEW}>New Project</option>
                </select>
                 <select className="p-2 border rounded" onChange={e => setNewProp({...newProp, type: e.target.value as PropertyType})}>
                  <option value={PropertyType.FLAT}>Flat</option>
                  <option value={PropertyType.VILLA}>Villa</option>
                  <option value={PropertyType.COMMERCIAL}>Commercial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <input type="number" placeholder="BHK (e.g. 2)" className="p-2 border rounded" onChange={e => setNewProp({...newProp, bhk: Number(e.target.value)})} />
                 <select className="p-2 border rounded" onChange={e => setNewProp({...newProp, status: e.target.value as PropertyStatus})}>
                  <option value={PropertyStatus.AVAILABLE}>Available</option>
                  <option value={PropertyStatus.SOLD}>Sold</option>
                </select>
              </div>

              <div className="border-t pt-4 mt-2">
                <p className="text-sm font-bold mb-2">Owner Details</p>
                <input required placeholder="Owner Name" className="w-full p-2 border rounded mb-2" onChange={e => setNewProp({...newProp, ownerName: e.target.value})} />
                <input required placeholder="Owner Phone" className="w-full p-2 border rounded" onChange={e => setNewProp({...newProp, ownerPhone: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 mt-2">Add to Inventory</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
