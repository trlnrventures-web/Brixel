
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { PipelineStage, LeadPriority, Lead } from '../types';
import { Phone, MessageCircle, MapPin, Plus, X, Brain, Send, Edit2, Save, Filter, Search, Ban, GripVertical, CheckSquare, Square, Trash2, ArrowRightCircle, Tag } from 'lucide-react';

const Pipeline: React.FC = () => {
  const { leads, addLead, updateLead, bulkUpdateLeads, deleteLeads } = useStore();
  const stages = Object.values(PipelineStage);
  
  // State for Modals
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Filter State
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterSource, setFilterSource] = useState<string>('All');

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Lead>>({});
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [tagInput, setTagInput] = useState('');

  // Bulk Selection State
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  // State for New Lead Form
  const [newLeadData, setNewLeadData] = useState({
    name: '', phone: '', budget: '', requirement: '', location: '', priority: LeadPriority.WARM
  });

  // Drag and Drop State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [activeDragStage, setActiveDragStage] = useState<PipelineStage | null>(null);

  // Derived Data for Filters
  const uniqueSources = Array.from(new Set(leads.map(l => l.source)));
  
  const filteredLeads = leads.filter(lead => {
    const matchesPriority = filterPriority === 'All' || lead.priority === filterPriority;
    const matchesSource = filterSource === 'All' || lead.source === filterSource;
    return matchesPriority && matchesSource;
  });

  const getLeadsByStage = (stage: PipelineStage) => filteredLeads.filter(lead => lead.stage === stage);

  // --- Handlers ---

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    if (activeDragStage !== stage) {
      setActiveDragStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Optional logic to clear highlight if needed
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    setActiveDragStage(null);
    if (draggedLeadId) {
      updateLead(draggedLeadId, { stage: targetStage });
      setDraggedLeadId(null);
    }
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `L${Date.now()}`,
      ...newLeadData,
      source: 'Direct Entry',
      stage: PipelineStage.NEW,
      lastContact: 'Just now',
      notes: [],
      tags: []
    };
    addLead(newLead);
    setIsNewDealOpen(false);
    setNewLeadData({ name: '', phone: '', budget: '', requirement: '', location: '', priority: LeadPriority.WARM });
  };

  const handleAddNote = () => {
    if (selectedLead && newNote.trim()) {
      const updatedNotes = [...(selectedLead.notes || []), {
        id: Date.now().toString(),
        text: newNote,
        date: new Date().toLocaleString()
      }];
      updateLead(selectedLead.id, { notes: updatedNotes });
      setNewNote('');
      setSelectedLead({ ...selectedLead, notes: updatedNotes });
    }
  };

  const analyzeLead = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = "AI Analysis: High Intent. Budget matches market rate for " + selectedLead?.location + ". Recommend scheduling site visit within 24 hours.";
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  // --- Editing & Validation ---

  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    if (field === 'name') {
       if (!value.trim()) errors.name = "Name is required";
       else delete errors.name;
    }
    if (field === 'phone') {
       const phoneRegex = /^\+?[0-9\s\-]{10,}$/;
       if (!value.match(phoneRegex)) errors.phone = "Invalid phone format";
       else delete errors.phone;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const startEditing = () => {
    if (selectedLead) {
      setEditFormData(selectedLead);
      setValidationErrors({});
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData({});
    setValidationErrors({});
  };

  const saveEditing = async () => {
    if (selectedLead && editFormData) {
      // Run full validation
      let isValid = true;
      if (!editFormData.name || !editFormData.name.trim()) {
         setValidationErrors(prev => ({...prev, name: 'Name is required'}));
         isValid = false;
      }
      const phoneRegex = /^\+?[0-9\s\-]{10,}$/;
      if (editFormData.phone && !editFormData.phone.match(phoneRegex)) {
         setValidationErrors(prev => ({...prev, phone: 'Invalid phone format'}));
         isValid = false;
      }

      if (!isValid) return;

      await updateLead(selectedLead.id, editFormData);
      setSelectedLead({ ...selectedLead, ...editFormData } as Lead);
      setIsEditing(false);
    }
  };

  const handleEditChange = (field: keyof Lead, value: any) => {
    setEditFormData(prev => ({...prev, [field]: value}));
    if (typeof value === 'string') {
       validateField(field, value);
    }
  };

  // --- Tags ---
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = editFormData.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        const newTags = [...currentTags, tagInput.trim()];
        setEditFormData(prev => ({ ...prev, tags: newTags }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = editFormData.tags || [];
    setEditFormData(prev => ({ ...prev, tags: currentTags.filter(t => t !== tagToRemove) }));
  };

  // --- Bulk Actions ---

  const toggleLeadSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSet = new Set(selectedLeadIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedLeadIds(newSet);
  };

  const handleBulkStageChange = (stage: PipelineStage) => {
    bulkUpdateLeads(Array.from(selectedLeadIds), { stage });
    setSelectedLeadIds(new Set());
  };

  const handleBulkPriorityChange = (priority: LeadPriority) => {
    bulkUpdateLeads(Array.from(selectedLeadIds), { priority });
    setSelectedLeadIds(new Set());
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedLeadIds.size} leads?`)) {
      deleteLeads(Array.from(selectedLeadIds));
      setSelectedLeadIds(new Set());
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deal Pipeline</h1>
          <p className="text-slate-500 text-sm hidden md:block">Drag and drop leads to move them through stages.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Filters */}
          <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm w-full md:w-auto">
             <div className="px-2 text-slate-400">
               <Filter className="w-4 h-4" />
             </div>
             <div className="relative border-r border-gray-100">
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer pr-8 pl-2 py-1 appearance-none w-full md:w-auto"
                >
                  <option value="All">All Priorities</option>
                  <option value={LeadPriority.HOT}>Hot</option>
                  <option value={LeadPriority.WARM}>Warm</option>
                  <option value={LeadPriority.COLD}>Cold</option>
                </select>
             </div>
             <div className="relative">
               <select 
                 value={filterSource}
                 onChange={(e) => setFilterSource(e.target.value)}
                 className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer pr-8 pl-2 py-1 appearance-none w-full md:w-auto"
               >
                 <option value="All">All Sources</option>
                 {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
          </div>

          <button 
            onClick={() => setIsNewDealOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center shadow-sm hover:bg-blue-700 whitespace-nowrap w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> New Deal
          </button>
        </div>
      </div>

      {/* Pipeline Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden -mx-4 px-4 md:mx-0 md:px-0 pb-20 no-scrollbar">
        <div className="flex h-full space-x-4 min-w-max">
          {stages.map((stage) => {
             const stageLeads = getLeadsByStage(stage);
             const totalValue = stageLeads.length * 1.5; // Mock Value estimation
             const isActive = activeDragStage === stage;
             
             return (
              <div 
                key={stage} 
                className={`w-80 flex flex-col h-full rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-blue-50 ring-2 ring-blue-400 ring-opacity-50' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Stage Header */}
                <div className={`flex flex-col mb-3 p-3 rounded-t-xl border-b-2 shadow-sm select-none transition-colors ${
                  isActive ? 'bg-blue-100 border-blue-500' : 'bg-white border-blue-500'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{stage}</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">{stageLeads.length}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Est. ₹{totalValue > 0 ? `${totalValue} Cr` : '0'}</p>
                </div>

                {/* Droppable Area */}
                <div className="flex-1 rounded-b-xl p-2 overflow-y-auto space-y-3 custom-scrollbar pb-10">
                  {stageLeads.length === 0 && (
                    <div className={`h-32 flex items-center justify-center text-sm italic border-2 border-dashed rounded-lg m-2 transition-colors ${
                      isActive ? 'border-blue-300 text-blue-500 bg-blue-50' : 'border-gray-200 text-slate-400'
                    }`}>
                      {isActive ? 'Drop here' : 'Drag deals here'}
                    </div>
                  )}
                  {stageLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => { setSelectedLead(lead); setAnalysisResult(null); setIsEditing(false); }}
                      className={`bg-white p-4 rounded-lg shadow-sm border transition-all cursor-grab active:cursor-grabbing relative group transform hover:-translate-y-1 ${
                        selectedLeadIds.has(lead.id) ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-300'
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <div 
                         className="absolute top-2 left-2 z-20 cursor-pointer text-gray-400 hover:text-blue-600"
                         onClick={(e) => toggleLeadSelection(e, lead.id)}
                      >
                         {selectedLeadIds.has(lead.id) ? <CheckSquare className="w-5 h-5 text-blue-600 fill-blue-50" /> : <Square className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>

                      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
                        lead.priority === LeadPriority.HOT ? 'bg-red-500' :
                        lead.priority === LeadPriority.WARM ? 'bg-orange-400' : 'bg-blue-300'
                      }`} />
                      
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 pointer-events-none">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm mb-1 mt-1 pl-6">{lead.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mb-2 pl-6">{lead.budget} • {lead.requirement}</p>
                      
                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 pl-6">
                           {lead.tags.slice(0, 3).map((tag, idx) => (
                             <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[80px]">
                               {tag}
                             </span>
                           ))}
                           {lead.tags.length > 3 && <span className="text-[10px] text-slate-400">+{lead.tags.length - 3}</span>}
                        </div>
                      )}

                      <div className="flex items-center text-xs text-slate-400 mb-3 pl-6">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{lead.location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-[10px] text-slate-400 bg-gray-50 px-2 py-1 rounded">{lead.source}</span>
                        <div className="flex space-x-2">
                           <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                             <Phone className="w-3.5 h-3.5" />
                           </a>
                           <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                             <MessageCircle className="w-3.5 h-3.5" />
                           </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedLeadIds.size > 0 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white rounded-xl shadow-2xl p-2 px-4 flex items-center space-x-4 z-40 animate-in slide-in-from-bottom-5">
           <div className="flex items-center space-x-2 pr-4 border-r border-slate-700">
             <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded-full">{selectedLeadIds.size}</span>
             <span className="text-sm font-medium">Selected</span>
           </div>
           
           <div className="flex items-center space-x-1">
             <span className="text-xs text-slate-400 mr-1">Move to:</span>
             <select 
               onChange={(e) => handleBulkStageChange(e.target.value as PipelineStage)}
               className="bg-slate-800 text-xs rounded border border-slate-600 text-white p-1 focus:outline-none"
             >
               <option value="">Stage...</option>
               {stages.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
           </div>

           <div className="flex items-center space-x-1">
             <span className="text-xs text-slate-400 mr-1">Priority:</span>
             <select 
                onChange={(e) => handleBulkPriorityChange(e.target.value as LeadPriority)}
                className="bg-slate-800 text-xs rounded border border-slate-600 text-white p-1 focus:outline-none"
             >
               <option value="">Set...</option>
               <option value={LeadPriority.HOT}>Hot</option>
               <option value={LeadPriority.WARM}>Warm</option>
               <option value={LeadPriority.COLD}>Cold</option>
             </select>
           </div>

           <button 
             onClick={handleBulkDelete}
             className="p-1.5 hover:bg-red-900/50 text-red-400 rounded transition-colors"
             title="Delete Selected"
           >
             <Trash2 className="w-4 h-4" />
           </button>
           
           <button onClick={() => setSelectedLeadIds(new Set())} className="ml-2">
             <X className="w-4 h-4 text-slate-400 hover:text-white" />
           </button>
        </div>
      )}

      {/* New Deal Modal */}
      {isNewDealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Deal</h3>
              <button onClick={() => setIsNewDealOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-4">
              <input required placeholder="Client Name" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newLeadData.name} onChange={e => setNewLeadData({...newLeadData, name: e.target.value})} />
              <input required placeholder="Phone Number" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newLeadData.phone} onChange={e => setNewLeadData({...newLeadData, phone: e.target.value})} />
              <div className="flex space-x-2">
                <input required placeholder="Budget (e.g. 1.5 Cr)" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newLeadData.budget} onChange={e => setNewLeadData({...newLeadData, budget: e.target.value})} />
                <input required placeholder="Requirement (2BHK)" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newLeadData.requirement} onChange={e => setNewLeadData({...newLeadData, requirement: e.target.value})} />
              </div>
              <input required placeholder="Location" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newLeadData.location} onChange={e => setNewLeadData({...newLeadData, location: e.target.value})} />
              <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={newLeadData.priority} onChange={e => setNewLeadData({...newLeadData, priority: e.target.value as LeadPriority})}>
                <option value={LeadPriority.HOT}>Hot</option>
                <option value={LeadPriority.WARM}>Warm</option>
                <option value={LeadPriority.COLD}>Cold</option>
              </select>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">Add Lead</button>
            </form>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div className="flex-1 mr-4">
                {isEditing ? (
                   <div>
                     <input 
                       value={editFormData.name || ''}
                       onChange={(e) => handleEditChange('name', e.target.value)}
                       className={`text-xl font-bold text-slate-900 border-b-2 focus:outline-none w-full bg-blue-50/50 px-1 py-0.5 rounded-t ${validationErrors.name ? 'border-red-500' : 'border-blue-500'}`}
                       placeholder="Lead Name"
                       autoFocus
                     />
                     {validationErrors.name && <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>}
                   </div>
                ) : (
                   <h2 className="text-xl font-bold text-slate-900">{selectedLead.name}</h2>
                )}
                
                {isEditing ? (
                  <input 
                     value={editFormData.location || ''}
                     onChange={(e) => handleEditChange('location', e.target.value)}
                     className="text-sm text-slate-500 mt-2 border-b border-gray-300 focus:border-blue-500 outline-none w-full bg-transparent"
                     placeholder="Location"
                   />
                ) : (
                  <p className="text-sm text-slate-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {selectedLead.location}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <button onClick={saveEditing} className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm" title="Save Changes">
                      <Save className="w-4 h-4 mr-1.5" /> Save
                    </button>
                    <button onClick={cancelEditing} className="p-2 bg-gray-100 text-slate-500 rounded-lg hover:bg-gray-200 transition-colors" title="Cancel">
                      <Ban className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button onClick={startEditing} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit Lead">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-100 rounded-full text-slate-400 ml-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Edit Mode Inputs */}
              {isEditing && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                      <input 
                        value={editFormData.phone || ''} 
                        onChange={e => handleEditChange('phone', e.target.value)}
                        className={`w-full p-2 border rounded-lg mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.phone && <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget</label>
                      <input 
                        value={editFormData.budget || ''} 
                        onChange={e => handleEditChange('budget', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirement</label>
                      <input 
                        value={editFormData.requirement || ''} 
                        onChange={e => handleEditChange('requirement', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source</label>
                      <input 
                        value={editFormData.source || ''} 
                        onChange={e => handleEditChange('source', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                      <select 
                        value={editFormData.priority || LeadPriority.WARM} 
                        onChange={e => handleEditChange('priority', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                         <option value={LeadPriority.HOT}>Hot</option>
                         <option value={LeadPriority.WARM}>Warm</option>
                         <option value={LeadPriority.COLD}>Cold</option>
                      </select>
                    </div>

                    {/* Tag Input */}
                    <div className="md:col-span-2 border-t border-gray-200 pt-3 mt-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center mb-2">
                        <Tag className="w-3 h-3 mr-1" /> Custom Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                         {editFormData.tags?.map(tag => (
                           <span key={tag} className="bg-white border border-gray-300 text-slate-700 text-xs px-2 py-1 rounded-full flex items-center">
                             {tag} <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                           </span>
                         ))}
                      </div>
                      <input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Type tag and press Enter..."
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                 </div>
              )}

              {/* View Mode Details */}
              {!isEditing && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Budget</p>
                      <p className="font-bold text-slate-800 text-lg">{selectedLead.budget}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Looking For</p>
                      <p className="font-bold text-slate-800 text-lg">{selectedLead.requirement}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Source</p>
                      <p className="font-semibold text-slate-700">{selectedLead.source}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Phone</p>
                      <p className="font-semibold text-slate-700">{selectedLead.phone}</p>
                    </div>
                  </div>

                  {/* Tags Display */}
                  {selectedLead.tags && selectedLead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                       {selectedLead.tags.map(tag => (
                         <span key={tag} className="bg-gray-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                           #{tag}
                         </span>
                       ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI Analysis (Only in View Mode) */}
              {!isEditing && (
                <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-purple-900 flex items-center"><Brain className="w-5 h-5 mr-2" /> PropFlow Intelligence</h3>
                    {!analysisResult && !isAnalyzing && (
                      <button onClick={analyzeLead} className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full font-bold transition-colors">Analyse Lead</button>
                    )}
                  </div>
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2 text-purple-600 animate-pulse py-2">
                       <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-75"></div>
                       <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-150"></div>
                       <span className="text-sm font-medium">Crunching market data...</span>
                    </div>
                  ) : analysisResult ? (
                    <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-purple-100 mt-2">{analysisResult}</p>
                  ) : (
                    <p className="text-xs text-purple-400 mt-1">Click analyze to get AI insights on conversion probability and budget match.</p>
                  )}
                </div>
              )}

              {/* Pipeline Control (Only in View Mode) */}
              {!isEditing && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Current Stage</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(PipelineStage).map(stage => (
                      <button
                        key={stage}
                        onClick={() => { updateLead(selectedLead.id, { stage }); setSelectedLead({...selectedLead, stage}); }}
                        className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                          selectedLead.stage === stage 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                            : 'bg-white text-slate-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center"><Edit2 className="w-4 h-4 mr-2" /> Notes & Timeline</h3>
                <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto mb-3 space-y-3 border border-gray-200 custom-scrollbar">
                   {selectedLead.notes && selectedLead.notes.length > 0 ? selectedLead.notes.map(note => (
                     <div key={note.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                       <p className="text-sm text-slate-700">{note.text}</p>
                       <p className="text-[10px] text-slate-400 mt-1 text-right">{note.date}</p>
                     </div>
                   )) : <p className="text-center text-slate-400 text-sm italic py-4">No notes added yet.</p>}
                </div>
                {!isEditing && (
                  <div className="flex gap-2">
                    <input 
                      value={newNote} 
                      onChange={(e) => setNewNote(e.target.value)} 
                      placeholder="Add a note..." 
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <button onClick={handleAddNote} className="bg-slate-800 text-white px-4 rounded-lg hover:bg-slate-700 shadow-sm"><Send className="w-4 h-4" /></button>
                  </div>
                )}
              </div>

              {/* Actions (Only in View Mode) */}
              {!isEditing && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <a href={`tel:${selectedLead.phone}`} className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-center flex items-center justify-center shadow-lg shadow-green-100 transition-transform active:scale-95">
                    <Phone className="w-5 h-5 mr-2" /> Call Now
                  </a>
                  <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 rounded-xl font-bold text-center flex items-center justify-center transition-colors">
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
