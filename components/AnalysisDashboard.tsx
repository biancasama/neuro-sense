import React, { useState, useEffect } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Check, Copy, MessageCircle, AlertTriangle, ShieldCheck, Zap, Pencil, Trash2, Plus, X, Save } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
}

interface ReplyItem {
  id: string;
  label: string;
  text: string;
}

const AnalysisDashboard: React.FC<Props> = ({ result }) => {
  const [replies, setReplies] = useState<ReplyItem[]>([]);

  // Sync state when result changes (new analysis)
  useEffect(() => {
    if (result) {
      setReplies([
        { id: 'prof', label: 'Professional', text: result.replies.professional },
        { id: 'friend', label: 'Friendly', text: result.replies.friendly },
        { id: 'firm', label: 'Firm', text: result.replies.firm },
      ]);
    }
  }, [result]);

  if (!result) return null;

  const getRiskColors = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
          barColor: 'bg-emerald-500'
        };
      case RiskLevel.CAUTION:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          barColor: 'bg-amber-500'
        };
      case RiskLevel.CONFLICT:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          icon: <Zap className="w-6 h-6 text-rose-600" />,
          barColor: 'bg-rose-500'
        };
    }
  };

  const theme = getRiskColors(result.riskLevel);

  const handleAddReply = () => {
    const newId = `custom-${Date.now()}`;
    // Add new empty reply and set it to the list
    setReplies(prev => [...prev, { id: newId, label: 'Custom', text: '' }]);
  };

  const handleUpdateReply = (id: string, label: string, text: string) => {
    setReplies(prev => prev.map(r => r.id === id ? { ...r, label, text } : r));
  };

  const handleDeleteReply = (id: string) => {
    setReplies(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Vibe Check */}
        <div className={`col-span-1 rounded-3xl p-6 border ${theme.bg} ${theme.border} shadow-sm relative overflow-hidden`}>
           <div className="absolute top-0 right-0 p-3 opacity-10">
              {theme.icon}
           </div>
           
           <h3 className="text-sm uppercase tracking-wider font-bold mb-4 opacity-70 flex items-center gap-2">
             {theme.icon} Vibe Check
           </h3>
           
           <div className="flex flex-col items-center justify-center py-4">
             <span className={`text-4xl font-bold ${theme.text} mb-2 capitalize`}>
               {result.vibeLabel}
             </span>
             <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden mt-2">
                <div className={`h-full ${theme.barColor} transition-all duration-1000 w-full`} style={{ width: result.riskLevel === 'Safe' ? '33%' : result.riskLevel === 'Caution' ? '66%' : '100%' }}></div>
             </div>
             <p className={`mt-3 text-sm font-medium ${theme.text} opacity-80`}>
               Detected Level: {result.riskLevel}
             </p>
           </div>
        </div>

        {/* Card 2: Literal Translation */}
        <div className="col-span-1 bg-white rounded-3xl p-6 border border-cream-300 shadow-sm">
          <h3 className="text-sm text-sage-500 uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
            <MessageCircle size={18} />
            Literal Translation
          </h3>
          <ul className="space-y-3">
            {result.translation.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sage-800 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sage-400 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Card 3: Reply Coach */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-300 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm text-sage-500 uppercase tracking-wider font-bold flex items-center gap-2">
            <MessageCircle size={18} />
            Reply Coach
          </h3>
          <button 
            onClick={handleAddReply}
            className="text-xs font-semibold text-sage-600 bg-sage-50 px-3 py-1.5 rounded-lg border border-sage-200 hover:bg-sage-100 hover:border-sage-300 transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add Option
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {replies.map((reply) => (
            <EditableReplyCard 
              key={reply.id} 
              item={reply} 
              onUpdate={handleUpdateReply}
              onDelete={handleDeleteReply}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

const EditableReplyCard: React.FC<{
  item: ReplyItem;
  onUpdate: (id: string, label: string, text: string) => void;
  onDelete: (id: string) => void;
}> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(item.text === ''); // Automatically edit if text is empty (new item)
  const [label, setLabel] = useState(item.label);
  const [text, setText] = useState(item.text);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (text.trim() === '') return;
    onUpdate(item.id, label, text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (item.text === '') {
      // If it was a new empty item, delete it on cancel
      onDelete(item.id);
    } else {
      // Revert changes
      setLabel(item.label);
      setText(item.text);
      setIsEditing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEditing) {
    return (
       <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-sage-300 p-4 shadow-md relative animate-in fade-in zoom-in-95 duration-200">
         <div className="mb-3">
           <input 
             value={label}
             onChange={(e) => setLabel(e.target.value)}
             className="text-xs font-bold text-sage-700 uppercase tracking-wide bg-sage-50 px-2 py-1 rounded border border-sage-200 w-full focus:outline-none focus:border-sage-400 focus:ring-0"
             placeholder="LABEL"
           />
         </div>
         <textarea
           value={text}
           onChange={(e) => setText(e.target.value)}
           className="w-full flex-grow text-sage-800 text-sm p-3 bg-sage-50 rounded-lg border border-sage-200 focus:outline-none focus:border-sage-400 focus:ring-0 resize-none min-h-[100px]"
           placeholder="Type your reply here..."
           autoFocus
         />
         <div className="flex items-center justify-end gap-2 mt-3">
             <button 
               onClick={handleCancel}
               className="p-2 text-sage-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
               title="Cancel"
             >
                <X size={16} />
             </button>
             <button 
               onClick={handleSave} 
               className="p-2 text-white bg-sage-600 hover:bg-sage-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
               title="Save"
               disabled={!text.trim()}
             >
                <Save size={16} />
             </button>
         </div>
       </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-cream-50 rounded-2xl border border-cream-200 p-4 hover:border-sage-300 transition-all group relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-sage-500 uppercase tracking-wide px-1.5 py-0.5 bg-sage-100/50 rounded">{item.label}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-sage-400 hover:text-sage-700 hover:bg-sage-100 rounded-md transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
           <button 
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-sage-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <p className="text-sage-800 text-sm flex-grow leading-relaxed whitespace-pre-wrap">"{item.text}"</p>
      
      <div className="mt-4 flex justify-end">
          <button 
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-white border border-sage-200 text-sage-600 hover:bg-sage-50 hover:border-sage-300 shadow-sm'}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default AnalysisDashboard;