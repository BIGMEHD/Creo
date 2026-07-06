import React, { useState } from 'react';
import { useStore } from '../../store';
import { translations, toPersianDigits } from '../../i18n';
import { Idea, VideoStatus } from '../../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  AlertCircle, 
  HelpCircle,
  X,
  FileText
} from 'lucide-react';

export default function ContentCalendar() {
  const { language, ideas, updateIdea } = useStore();
  const t = translations[language];
  const isRtl = language === 'fa';
  const digitConv = language === 'fa';

  // Get current date context for monthly calendar drawing
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default to July 2026 to align with mock data
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Selected date for scheduling overlay
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Unscheduled ideas list
  const unscheduledIdeas = ideas.filter(i => !i.scheduledDate && i.status !== 'archived');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0, Monday=1...

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Convert month index to text
  const getMonthName = () => {
    const monthNamesEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthNamesFa = [
      'ژانویه (January)', 'فوریه (February)', 'مارس (March)', 'آوریل (April)', 'مه (May)', 'ژوئن (June)',
      'ژوئیه (July)', 'اوت (August)', 'سپتامبر (September)', 'اکتبر (October)', 'نوامبر (November)', 'دسامبر (December)'
    ];
    return language === 'fa' ? monthNamesFa[currentMonth] : monthNamesEn[currentMonth];
  };

  const weekdays = language === 'fa' 
    ? ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Status color pill mapper
  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case 'idea': return 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-200 dark:border-zinc-800';
      case 'scripting': return 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40';
      case 'ready_to_film': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-750';
      case 'filmed': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-750';
      case 'editing': return 'bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-750';
      case 'published': return 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40';
      default: return 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800';
    }
  };

  // Assign idea to date
  const handleAssignDate = (ideaId: string) => {
    if (!selectedDateStr) return;
    updateIdea(ideaId, { scheduledDate: selectedDateStr });
    setSelectedDateStr(null);
  };

  // Remove idea schedule date
  const handleUnschedule = (ideaId: string) => {
    updateIdea(ideaId, { scheduledDate: null });
  };

  // Mark Published quick checkbox toggle
  const handleTogglePublished = (idea: Idea, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: VideoStatus = idea.status === 'published' ? 'editing' : 'published';
    updateIdea(idea.id, { status: newStatus });
  };

  // Render Days Grid
  const renderDays = () => {
    const dayCells = [];
    
    // Empty prefix cells for preceding month overlap
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(
        <div key={`empty-${i}`} className="min-h-[100px] bg-zinc-50/40 dark:bg-zinc-950/10 border border-zinc-200 dark:border-zinc-800/50" />
      );
    }

    // Actual calendar month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const scheduledVideos = ideas.filter(i => i.scheduledDate === dayStr);

      dayCells.push(
        <div 
          key={day} 
          onClick={() => setSelectedDateStr(dayStr)}
          className="min-h-[110px] bg-white dark:bg-[#121214]/60 border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 cursor-pointer p-2 flex flex-col justify-between transition-all group relative"
        >
          {/* Day number */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-400 font-mono">
              {toPersianDigits(day, digitConv)}
            </span>
            <button 
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-500 transition-opacity p-0.5"
              title={t.scheduleIdea}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Videos scheduled on this day */}
          <div className="mt-1.5 space-y-1 flex-1 overflow-y-auto max-h-[80px] scrollbar-none">
            {scheduledVideos.map(video => (
              <div 
                key={video.id}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`text-[9px] p-1.5 rounded-lg border flex items-center justify-between gap-1 ${getStatusColor(video.status)}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate leading-tight" title={video.title}>
                    {video.title}
                  </p>
                </div>
                
                {/* Fast checkbox to published */}
                <button
                  onClick={(e) => handleTogglePublished(video, e)}
                  className={`p-0.5 rounded-md border shrink-0 transition-colors cursor-pointer ${video.status === 'published' ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-850'}`}
                  title={video.status === 'published' ? t.status_published : 'Mark Published'}
                >
                  <Check className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return dayCells;
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Editorial Calendar Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-red-600" />
            {t.calendarOverview}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t.dragDropSchedule}
          </p>
        </div>

        {/* Month Paging controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={prevMonth}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all border border-zinc-200 dark:border-zinc-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 font-mono min-w-[120px] text-center">
            {getMonthName()} {toPersianDigits(currentYear, digitConv)}
          </span>

          <button 
            onClick={nextMonth}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all border border-zinc-200 dark:border-zinc-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Calendar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Calendar Core Table Grid */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-xs">
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-2">
            {weekdays.map((day, idx) => (
              <div key={idx} className="py-2">{day}</div>
            ))}
          </div>

          {/* Days Cell Grid */}
          <div className="grid grid-cols-7 border-t border-l border-zinc-200 dark:border-zinc-800/80">
            {renderDays()}
          </div>
        </div>

        {/* Sidebar Panel: Unscheduled ideas bucket */}
        <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">
              {t.unscheduledIdeas}
            </h3>
            <span className="font-mono text-xs font-bold text-red-500 bg-red-950/25 px-2.5 py-0.5 rounded-full">
              {toPersianDigits(unscheduledIdeas.length, digitConv)}
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed">
            {language === 'fa' 
              ? 'ایده‌های خام یا در حال نگارش فاقد زمان‌بندی انتشار. روی روزهای تقویم کلیک کنید تا تاریخ پخش هرکدام را تنظیم کنید.'
              : 'Draft ideas or script outlines. Assign them a release slot directly.'}
          </p>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
            {unscheduledIdeas.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6">{language === 'fa' ? 'تمام ایده‌ها زمان‌بندی شده‌اند!' : 'All ideas are scheduled!'}</p>
            ) : (
              unscheduledIdeas.map(idea => (
                <div 
                  key={idea.id}
                  className="bg-zinc-50 dark:bg-[#121214] p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 hover:border-red-600 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-red-500 bg-red-950/20 border border-red-900/20 px-2 py-0.5 rounded-md inline-block uppercase font-bold font-mono">
                      {t[`status_${idea.status}`]}
                    </span>
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 truncate mt-1">
                      {idea.title}
                    </h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* SCHEDULER POPUP SELECTOR */}
      {selectedDateStr && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0c0c0e] w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {t.scheduleIdea}
                </h3>
                <span className="text-xs font-mono text-red-500 block mt-0.5">
                  {toPersianDigits(selectedDateStr, digitConv)}
                </span>
              </div>
              <button onClick={() => setSelectedDateStr(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of assignable ideas */}
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {unscheduledIdeas.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">{language === 'fa' ? 'تمام ایده‌ها زمان‌بندی شده‌اند! ابتدا ایده جدیدی ایجاد کنید.' : 'No unscheduled ideas found. Create one first!'}</p>
              ) : (
                unscheduledIdeas.map(idea => (
                  <button
                    key={idea.id}
                    onClick={() => handleAssignDate(idea.id)}
                    className="w-full text-left bg-zinc-50 dark:bg-zinc-800 hover:bg-red-950/20 dark:hover:bg-zinc-700/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <div className="bg-red-600 text-white p-1.5 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 truncate text-start">
                        {idea.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono block text-start mt-0.5">
                        {t[`status_${idea.status}`]}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Scheduled videos details of that specific day */}
            {ideas.filter(v => v.scheduledDate === selectedDateStr).length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider mb-2">
                  {language === 'fa' ? 'ویدیوهای زمان‌بندی شده در این تاریخ:' : 'Already Scheduled on this Day:'}
                </span>
                <div className="space-y-1.5">
                  {ideas.filter(v => v.scheduledDate === selectedDateStr).map(v => (
                    <div key={v.id} className="flex justify-between items-center text-xs bg-zinc-100/50 dark:bg-[#121214] p-2 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                      <span className="truncate max-w-[200px] text-zinc-700 dark:text-zinc-300 font-medium">{v.title}</span>
                      <button 
                        onClick={() => handleUnschedule(v.id)}
                        className="text-red-500 hover:underline text-[10px] cursor-pointer"
                      >
                        {language === 'fa' ? 'لغو زمان‌بندی' : 'Unschedule'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
              <button
                onClick={() => setSelectedDateStr(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl cursor-pointer"
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
