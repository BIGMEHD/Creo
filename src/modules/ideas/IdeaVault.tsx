import React, { useState } from 'react';
import { useStore } from '../../store';
import { translations, toPersianDigits } from '../../i18n';
import { Idea, VideoStatus, Priority, ChecklistItem } from '../../types';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  ExternalLink, 
  FileText, 
  CheckSquare, 
  Trash2, 
  Eye, 
  Tag, 
  Edit, 
  X,
  PlusCircle,
  FolderOpen
} from 'lucide-react';

interface IdeaVaultProps {
  onNavigateToScript: (ideaId: string) => void;
}

export default function IdeaVault({ onNavigateToScript }: IdeaVaultProps) {
  const { 
    language, 
    ideas, 
    series, 
    addIdea, 
    updateIdea, 
    deleteIdea, 
    moveIdeaStatus,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem
  } = useStore();

  const t = translations[language];
  const isRtl = language === 'fa';
  const digitConv = language === 'fa';

  // State Management
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedSeries, setSelectedSeries] = useState<string | 'all'>('all');
  
  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);

  // Form State for new idea
  const [title, setTitle] = useState('');
  const [hook, setHook] = useState('');
  const [priority, setPriority] = useState<Priority>('hot');
  const [status, setStatus] = useState<VideoStatus>('idea');
  const [tagsStr, setTagsStr] = useState('');
  const [notes, setNotes] = useState('');
  const [linksStr, setLinksStr] = useState('');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');

  // Form State for edit notes/details inside detail modal
  const [editNotes, setEditNotes] = useState('');
  const [newCheckItemText, setNewCheckItemText] = useState('');
  const [newABTitle, setNewABTitle] = useState('');
  const [newABNotes, setNewABNotes] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [descriptionTemplate, setDescriptionTemplate] = useState('');

  const activeIdea = ideas.find(i => i.id === activeIdeaId);

  // Search and Filter logic
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          idea.hook.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = selectedPriority === 'all' || idea.priority === selectedPriority;
    const matchesSeries = selectedSeries === 'all' || idea.seriesId === selectedSeries;
    return matchesSearch && matchesPriority && matchesSeries;
  });

  const columns: { id: VideoStatus; title: string; color: string }[] = [
    { id: 'idea', title: t.status_idea, color: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200' },
    { id: 'scripting', title: t.status_scripting, color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300' },
    { id: 'ready_to_film', title: t.status_ready_to_film, color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300' },
    { id: 'filmed', title: t.status_filmed, color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300' },
    { id: 'editing', title: t.status_editing, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300' },
    { id: 'published', title: t.status_published, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean);
    const links = linksStr.split(',').map(s => s.trim()).filter(Boolean);

    addIdea({
      title,
      hook,
      priority,
      status,
      tags,
      notes,
      links,
      thumbnailUrl: null,
      seriesId: selectedSeriesId || null,
      scheduledDate: null,
    });

    // Reset Form
    setTitle('');
    setHook('');
    setPriority('hot');
    setStatus('idea');
    setTagsStr('');
    setNotes('');
    setLinksStr('');
    setSelectedSeriesId('');
    setIsCreateOpen(false);
  };

  const openDetailModal = (idea: Idea) => {
    setActiveIdeaId(idea.id);
    setEditNotes(idea.notes || '');
    setDescriptionTemplate(idea.descriptionTemplate || '');
    setIsDetailOpen(true);
  };

  const handleUpdateNotes = () => {
    if (activeIdeaId) {
      updateIdea(activeIdeaId, { notes: editNotes, descriptionTemplate });
    }
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckItemText.trim() || !activeIdeaId) return;
    addChecklistItem(activeIdeaId, newCheckItemText);
    setNewCheckItemText('');
  };

  const handleAddABVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newABTitle.trim() || !activeIdeaId || !activeIdea) return;
    const newVariant = {
      id: `ab-${Date.now()}`,
      title: newABTitle,
      notes: newABNotes,
    };
    updateIdea(activeIdeaId, {
      abNotes: [...activeIdea.abNotes, newVariant]
    });
    setNewABTitle('');
    setNewABNotes('');
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !activeIdeaId || !activeIdea) return;
    const currentKeywords = activeIdea.keywords || [];
    if (!currentKeywords.includes(newKeyword.trim())) {
      updateIdea(activeIdeaId, {
        keywords: [...currentKeywords, newKeyword.trim()]
      });
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (!activeIdeaId || !activeIdea) return;
    updateIdea(activeIdeaId, {
      keywords: (activeIdea.keywords || []).filter(k => k !== keyword)
    });
  };

  const handleConvertScriptClick = (ideaId: string) => {
    setIsDetailOpen(false);
    onNavigateToScript(ideaId);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-red-600" />
            {t.ideaVault}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {language === 'fa' ? 'طوفان فکری، برنامه‌ریزی و پردازش ایده‌ها قبل از شروع سناریو نویسی' : 'Brainstorm, organize, and transition ideas seamlessly.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* View Toggles */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              title={t.kanbanView}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              title={t.listView}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-900/10"
          >
            <Plus className="w-4 h-4" />
            {t.newIdea}
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-red-600 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Priority filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority | 'all')}
              className="bg-transparent border-none text-xs text-zinc-600 dark:text-zinc-300 focus:ring-0 cursor-pointer outline-hidden font-medium"
            >
              <option value="all">{t.priority}: {t.all}</option>
              <option value="hot">{t.hot}</option>
              <option value="warm">{t.warm}</option>
              <option value="cold">{t.cold}</option>
            </select>
          </div>

          {/* Series filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
            <Tag className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="bg-transparent border-none text-xs text-zinc-600 dark:text-zinc-300 focus:ring-0 cursor-pointer outline-hidden font-medium max-w-[150px]"
            >
              <option value="all">{t.seriesManager}: {t.all}</option>
              {series.map(s => (
                <option key={s.id} value={s.id}>{s.name.split(' / ')[language === 'fa' ? 1 : 0]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {columns.map(column => {
            const columnIdeas = filteredIdeas.filter(i => i.status === column.id);
            return (
              <div 
                key={column.id} 
                className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col w-[260px] md:w-[280px] shrink-0 max-h-[750px] overflow-hidden"
              >
                {/* Column Title */}
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${column.color}`}>
                    {column.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded-md">
                    {toPersianDigits(columnIdeas.length, digitConv)}
                  </span>
                </div>

                {/* Ideas list */}
                <div className="flex-1 space-y-3 overflow-y-auto min-h-[200px] scrollbar-thin">
                  {columnIdeas.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-400 text-center leading-relaxed">
                        {t.noIdeasYet}
                      </span>
                    </div>
                  ) : (
                    columnIdeas.map(idea => {
                      const linkedSeries = series.find(s => s.id === idea.seriesId);
                      const completedTasks = idea.checklist.filter(c => c.completed).length;
                      const totalTasks = idea.checklist.length;

                      return (
                        <div
                          key={idea.id}
                          onClick={() => openDetailModal(idea)}
                          className="bg-white dark:bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-red-600 dark:hover:border-zinc-700 cursor-pointer shadow-2xs hover:shadow-xs transition-all group relative space-y-2.5"
                        >
                          {/* Card Series Tag */}
                          {linkedSeries && (
                            <span 
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm inline-block"
                              style={{ backgroundColor: `${linkedSeries.color}15`, color: linkedSeries.color }}
                            >
                              {linkedSeries.name.split(' / ')[language === 'fa' ? 1 : 0]}
                            </span>
                          )}

                          {/* Title */}
                          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-relaxed group-hover:text-red-600 transition-colors">
                            {idea.title}
                          </h4>

                          {/* Hook snippet */}
                          {idea.hook && (
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
                              {idea.hook}
                            </p>
                          )}

                          {/* Footer details */}
                          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-2 text-[10px] text-zinc-400">
                            {/* Priority Badge */}
                            <span className="font-semibold text-zinc-500">
                              {idea.priority === 'hot' ? '🔥' : idea.priority === 'warm' ? '⚡' : '❄️'}{' '}
                              {t[idea.priority]}
                            </span>
                            
                            {/* Checklist mini progress */}
                            {totalTasks > 0 && (
                              <span className="flex items-center gap-1 font-mono font-medium text-zinc-500 bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                                <CheckSquare className="w-3 h-3 text-zinc-400" />
                                {toPersianDigits(completedTasks, digitConv)}/{toPersianDigits(totalTasks, digitConv)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View Mode */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className={`px-6 py-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t.title}</th>
                  <th className={`px-6 py-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t.priority}</th>
                  <th className={`px-6 py-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t.status}</th>
                  <th className={`px-6 py-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t.seriesManager}</th>
                  <th className={`px-6 py-3 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t.checklist}</th>
                  <th className="px-6 py-3 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredIdeas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-zinc-400">
                      {t.noIdeasYet}
                    </td>
                  </tr>
                ) : (
                  filteredIdeas.map(idea => {
                    const linkedSeries = series.find(s => s.id === idea.seriesId);
                    const completedTasks = idea.checklist.filter(c => c.completed).length;
                    const totalTasks = idea.checklist.length;
                    
                    return (
                      <tr 
                        key={idea.id} 
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer"
                        onClick={() => openDetailModal(idea)}
                      >
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-100 truncate">{idea.title}</h4>
                            <p className="text-xs text-zinc-400 truncate mt-0.5">{idea.hook}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold">
                            {idea.priority === 'hot' ? '🔥 ' : idea.priority === 'warm' ? '⚡ ' : '❄️ '}
                            {t[idea.priority]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">
                            {t[`status_${idea.status}`]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {linkedSeries ? (
                            <span 
                              className="text-xs px-2.5 py-1 rounded-full font-semibold"
                              style={{ backgroundColor: `${linkedSeries.color}15`, color: linkedSeries.color }}
                            >
                              {linkedSeries.name.split(' / ')[language === 'fa' ? 1 : 0]}
                            </span>
                          ) : (
                            <span className="text-zinc-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {totalTasks > 0 ? (
                            <span className="font-medium">
                              {toPersianDigits(completedTasks, digitConv)}/{toPersianDigits(totalTasks, digitConv)}
                            </span>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleConvertScriptClick(idea.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-lg transition-all"
                              title={t.convertToScript}
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteIdea(idea.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                              title={t.delete}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE IDEA MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {t.newIdea}
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.ideaTitle} *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  required
                />
              </div>

              {/* Hook */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.oneLineHook}</label>
                <textarea
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  className="w-full h-16 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 resize-none focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Grid 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.priority}</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                  >
                    <option value="hot">{t.hot}</option>
                    <option value="warm">{t.warm}</option>
                    <option value="cold">{t.cold}</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.status}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VideoStatus)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                  >
                    <option value="idea">{t.status_idea}</option>
                    <option value="scripting">{t.status_scripting}</option>
                    <option value="ready_to_film">{t.status_ready_to_film}</option>
                    <option value="filmed">{t.status_filmed}</option>
                    <option value="editing">{t.status_editing}</option>
                    <option value="published">{t.status_published}</option>
                  </select>
                </div>
              </div>

              {/* Series Select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.seriesManager}</label>
                <select
                  value={selectedSeriesId}
                  onChange={(e) => setSelectedSeriesId(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                >
                  <option value="">{t.none}</option>
                  {series.map(s => (
                    <option key={s.id} value={s.id}>{s.name.split(' / ')[language === 'fa' ? 1 : 0]}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.tagsPlaceholder}</label>
                <input
                  type="text"
                  placeholder="React, NextJS, Tutorial"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              {/* Links */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.linksPlaceholder}</label>
                <input
                  type="text"
                  placeholder="https://example.com, https://github.com"
                  value={linksStr}
                  onChange={(e) => setLinksStr(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-24 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden resize-none"
                />
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-900/10"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE DETAIL MODAL */}
      {isDetailOpen && activeIdea && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#0c0c0e] w-full max-w-4xl rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="space-y-1 flex-1 min-w-0 pr-4">
                {/* Status Column */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                    IDEA ID: {toPersianDigits(activeIdea.id, digitConv)}
                  </span>
                  <select
                    value={activeIdea.status}
                    onChange={(e) => updateIdea(activeIdea.id, { status: e.target.value as VideoStatus })}
                    className="bg-red-950/20 text-red-500 border-none font-bold text-[10px] px-2.5 py-1 rounded-md cursor-pointer outline-hidden focus:ring-0"
                  >
                    <option value="idea">{t.status_idea}</option>
                    <option value="scripting">{t.status_scripting}</option>
                    <option value="ready_to_film">{t.status_ready_to_film}</option>
                    <option value="filmed">{t.status_filmed}</option>
                    <option value="editing">{t.status_editing}</option>
                    <option value="published">{t.status_published}</option>
                  </select>

                  <select
                    value={activeIdea.priority}
                    onChange={(e) => updateIdea(activeIdea.id, { priority: e.target.value as Priority })}
                    className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-none font-bold text-[10px] px-2.5 py-1 rounded-md cursor-pointer outline-hidden focus:ring-0"
                  >
                    <option value="hot">{t.hot}</option>
                    <option value="warm">{t.warm}</option>
                    <option value="cold">{t.cold}</option>
                  </select>
                </div>

                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug mt-2">
                  {activeIdea.title}
                </h3>
                <p className="text-xs text-red-500 font-medium">
                  "{activeIdea.hook}"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleConvertScriptClick(activeIdea.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-900/10"
                >
                  <FileText className="w-4 h-4" />
                  {t.convertToScript}
                </button>
                <button onClick={() => setIsDetailOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Tabs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Column 1: Notes & Metadata */}
              <div className="space-y-6">
                
                {/* Notes Editor */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    {t.notes}
                  </span>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    onBlur={handleUpdateNotes}
                    placeholder={language === 'fa' ? 'یادداشت‌های فنی، ایده‌ها، ساختار فیلم‌برداری...' : 'Technical details, cinematography thoughts, timestamps...'}
                    className="w-full h-40 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-sky-500 resize-none transition-all"
                  />
                </div>

                {/* Tags and Links */}
                <div className="space-y-4 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">{t.tagsPlaceholder}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeIdea.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-2.5 py-1 rounded-md font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {activeIdea.links.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">{t.linksPlaceholder}</span>
                      <div className="space-y-1">
                        {activeIdea.links.map((link, i) => (
                          <a 
                            key={i} 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-sky-500 hover:underline flex items-center gap-1.5 truncate"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SEO Assistant inside detail */}
                <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    {t.seoHelperTitle}
                  </h4>
                  
                  {/* Keywords tag builder */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-400 font-semibold block">{t.keywords}</span>
                    <form onSubmit={handleAddKeyword} className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder={t.addKeyword}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-100 flex-1 focus:outline-hidden"
                      />
                      <button type="submit" className="bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-700 text-white p-1 rounded-lg">
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </form>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(activeIdea.keywords || []).map((kw, idx) => (
                        <span key={idx} className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          {kw}
                          <button onClick={() => handleRemoveKeyword(kw)} className="text-zinc-400 hover:text-rose-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description Outline Template */}
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] text-zinc-400 font-semibold block">{t.descriptionTemplate}</span>
                    <textarea
                      value={descriptionTemplate}
                      onChange={(e) => setDescriptionTemplate(e.target.value)}
                      onBlur={handleUpdateNotes}
                      placeholder="Chapters:\n0:00 Intro\n1:00 Concept..."
                      className="w-full h-24 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden resize-none font-mono"
                    />
                  </div>
                </div>

              </div>

              {/* Column 2: Tasks Checklist & Title Variants A/B testing */}
              <div className="space-y-6">
                
                {/* Dynamic Checklist */}
                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-red-500" />
                      {t.checklist}
                    </h4>
                    <span className="text-xs font-mono font-semibold text-zinc-500">
                      {toPersianDigits(activeIdea.checklist.filter(c => c.completed).length, digitConv)}/{toPersianDigits(activeIdea.checklist.length, digitConv)}
                    </span>
                  </div>

                  {/* Checklist display */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {activeIdea.checklist.length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center py-4">{language === 'fa' ? 'هیچ چک‌لیستی تعریف نشده است. کارهای سناریو، فیلم‌برداری یا تدوین را در کادر زیر بنویسید.' : 'No checklist items yet. Write production checklists below.'}</p>
                    ) : (
                      activeIdea.checklist.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleChecklistItem(activeIdea.id, item.id)}
                              className="rounded-md border-zinc-300 dark:border-zinc-800 text-red-600 focus:ring-red-600 h-4 w-4"
                            />
                            <span className={`text-xs ${item.completed ? 'line-through text-zinc-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                              {item.text}
                            </span>
                          </label>
                          <button
                            onClick={() => deleteChecklistItem(activeIdea.id, item.id)}
                            className="text-zinc-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Checklist adder form */}
                  <form onSubmit={handleAddChecklist} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.addChecklistItem}
                      value={newCheckItemText}
                      onChange={(e) => setNewCheckItemText(e.target.value)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 flex-1 focus:outline-hidden"
                      required
                    />
                    <button 
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-red-900/10"
                    >
                      {t.add}
                    </button>
                  </form>
                </div>

                {/* Title & Thumbnail A/B Testing notes inside detailed popup */}
                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                  <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <Edit className="w-4 h-4 text-emerald-500" />
                    {t.titleVariants} / {t.thumbnailA_B}
                  </h4>

                  {/* List of A/B titles */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(activeIdea.abNotes || []).length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center py-4">{t.abNotesPlaceholder}</p>
                    ) : (
                      activeIdea.abNotes.map(item => (
                        <div key={item.id} className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 block">{item.title}</span>
                          {item.notes && <p className="text-[10px] text-zinc-400">{item.notes}</p>}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Variant Adder */}
                  <form onSubmit={handleAddABVariant} className="space-y-2">
                    <input
                      type="text"
                      placeholder={language === 'fa' ? 'عنوان پیشنهادی جایگزین...' : 'Alternative Title variant...'}
                      value={newABTitle}
                      onChange={(e) => setNewABTitle(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={language === 'fa' ? 'توضیحات تست (کنتراست کاور، مخاطب هدف)...' : 'Variant notes (eg: high CTR potential, scary look)...'}
                        value={newABNotes}
                        onChange={(e) => setNewABNotes(e.target.value)}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 flex-1 focus:outline-hidden"
                      />
                      <button 
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        {t.add}
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>

            {/* Detailed Delete option */}
            <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-5">
              <button
                onClick={() => {
                  if (confirm(language === 'fa' ? 'آیا از حذف این ایده مطمئن هستید؟' : 'Are you sure you want to delete this idea?')) {
                    deleteIdea(activeIdea.id);
                    setIsDetailOpen(false);
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-rose-100 dark:bg-zinc-800 dark:border-zinc-800"
              >
                <Trash2 className="w-4 h-4" />
                {t.delete}
              </button>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
              >
                {t.close}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
