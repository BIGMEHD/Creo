import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { translations, toPersianDigits } from '../../i18n';
import { Script, ScriptSection } from '../../types';
import { 
  FileText, 
  Clock, 
  Gauge, 
  History, 
  Save, 
  CornerUpLeft, 
  Check, 
  Layers,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface ScriptWriterProps {
  activeIdeaId: string | null;
  onSelectIdea: (id: string) => void;
}

export default function ScriptWriter({ activeIdeaId, onSelectIdea }: ScriptWriterProps) {
  const { 
    language, 
    ideas, 
    scripts, 
    wpm, 
    setWpm, 
    updateScript, 
    saveScriptVersion, 
    restoreScriptVersion 
  } = useStore();

  const t = translations[language];
  const isRtl = language === 'fa';
  const digitConv = language === 'fa';

  const [autosaveStatus, setAutosaveStatus] = useState<string>('');
  const [activeVersionTab, setActiveVersionTab] = useState<boolean>(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // If no active idea is selected, default to the first scripting/idea that exists
  const selectableIdeas = ideas.filter(i => i.status !== 'published' && i.status !== 'archived');
  const currentIdeaId = activeIdeaId || selectableIdeas[0]?.id || null;
  const currentIdea = ideas.find(i => i.id === currentIdeaId);

  // Get current script state
  const currentScript: Script = scripts[currentIdeaId || ''] || {
    id: currentIdeaId || '',
    ideaId: currentIdeaId || '',
    sections: { hook: '', intro: '', mainPoints: '', cta: '', outro: '' },
    wordCount: 0,
    estimatedRuntime: 0,
    lastSaved: '',
    history: []
  };

  const handleSectionChange = (sectionKey: keyof ScriptSection, text: string) => {
    if (!currentIdeaId) return;

    // Direct update to store
    updateScript(currentIdeaId, { [sectionKey]: text });

    // Simulate distraction-free autosave status
    setAutosaveStatus('Saving...');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setAutosaveStatus(t.autosaved);
    }, 1500);
  };

  const triggerSaveVersion = () => {
    if (!currentIdeaId) return;
    saveScriptVersion(currentIdeaId);
    setAutosaveStatus('Version Captured!');
    setTimeout(() => {
      setAutosaveStatus(t.autosaved);
    }, 2000);
  };

  const triggerRestoreVersion = (versionId: string) => {
    if (!currentIdeaId) return;
    restoreScriptVersion(currentIdeaId, versionId);
    setActiveVersionTab(false);
  };

  // Humanize estimated runtime (seconds -> min:sec)
  const formatRuntime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    return toPersianDigits(formatted, digitConv);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Script Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-600" />
            {t.scriptWriter}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {language === 'fa' ? 'ساختار سناریونویسی و زمان‌بندی دقیق ویدیوها به روش متمرکز و گام‌به‌گام' : 'Distraction-free, structured outline script editor for high-performing videos.'}
          </p>
        </div>

        {/* Idea Select Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{language === 'fa' ? 'انتخاب ویدیو:' : 'Active Video:'}</label>
          <select
            value={currentIdeaId || ''}
            onChange={(e) => onSelectIdea(e.target.value)}
            className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600 max-w-xs cursor-pointer"
          >
            {ideas.map(i => (
              <option key={i.id} value={i.id}>
                [{t[`status_${i.status}`]}] {i.title.substring(0, 45)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scripting Scaffold with No Idea Selected guard */}
      {!currentIdeaId ? (
        <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30">
          <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300">{language === 'fa' ? 'هیچ ایده‌ای موجود نیست' : 'No Ideas Found'}</h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-sm mx-auto">
            {language === 'fa' ? 'برای نگارش ابتدا باید یک ایده در بخش صندوق ایده‌ها اضافه کنید و روی "تبدیل به سناریو" کلیک کنید.' : 'Create an idea in the Idea Vault first and tap Convert to Script to start writing!'}
          </p>
        </div>
      ) : (
        /* Active Script Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main Editing Column */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-6 space-y-6">
            
            {/* Context bar / Title reference */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-md">
                  {t.writeScriptFor}: <span className="text-red-500">"{currentIdea?.title}"</span>
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {autosaveStatus && (
                  <span className="text-[10px] text-zinc-400 font-mono italic animate-pulse">
                    {autosaveStatus}
                  </span>
                )}
                <button
                  onClick={triggerSaveVersion}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 transition-colors"
                  title="Capture Version Snapshot"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Section-by-Section Text Editors */}
            <div className="space-y-6">
              {/* SECTION 1: HOOK */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {t.sectionHook}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">{toPersianDigits(currentScript.sections.hook.trim() ? currentScript.sections.hook.trim().split(/\s+/).length : 0, digitConv)} {language === 'fa' ? 'کلمه' : 'words'}</span>
                </div>
                <textarea
                  value={currentScript.sections.hook}
                  onChange={(e) => handleSectionChange('hook', e.target.value)}
                  placeholder={language === 'fa' ? 'کلمات جادویی و تکان‌دهنده ۱۵ ثانیه اول ویدیو برای تداوم ماندگاری تماشاگر در فیلم...' : 'Open with an undeniable hook! Address a vital pain-point instantly.'}
                  className="w-full h-28 bg-zinc-50/50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:bg-white dark:focus:bg-[#0c0c0e] focus:ring-1 focus:ring-red-600 transition-all leading-relaxed"
                />
              </div>

              {/* SECTION 2: INTRO */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {t.sectionIntro}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">{toPersianDigits(currentScript.sections.intro.trim() ? currentScript.sections.intro.trim().split(/\s+/).length : 0, digitConv)} {language === 'fa' ? 'کلمه' : 'words'}</span>
                </div>
                <textarea
                  value={currentScript.sections.intro}
                  onChange={(e) => handleSectionChange('intro', e.target.value)}
                  placeholder={language === 'fa' ? 'معرفی خودتان، برندتان و توضیح سریع اینکه تماشاگر در این ویدیو چه سودی عایدش می‌شود...' : 'Introduce the topic briefly. Promise the exact solution they are waiting for.'}
                  className="w-full h-28 bg-zinc-50/50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:bg-white dark:focus:bg-[#0c0c0e] focus:ring-1 focus:ring-red-600 transition-all leading-relaxed"
                />
              </div>

              {/* SECTION 3: MAIN POINTS */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {t.sectionMainPoints}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">{toPersianDigits(currentScript.sections.mainPoints.trim() ? currentScript.sections.mainPoints.trim().split(/\s+/).length : 0, digitConv)} {language === 'fa' ? 'کلمه' : 'words'}</span>
                </div>
                <textarea
                  value={currentScript.sections.mainPoints}
                  onChange={(e) => handleSectionChange('mainPoints', e.target.value)}
                  placeholder={language === 'fa' ? 'بدنه اصلی ویدیو: بخش‌های مختلف، آموزش کامل، روایت یا رازهای ارزشمندی که وعده داده بودید...' : 'Value Delivery. Break down ideas step-by-step with zero fluff.'}
                  className="w-full h-64 bg-zinc-50/50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:bg-white dark:focus:bg-[#0c0c0e] focus:ring-1 focus:ring-red-600 transition-all leading-relaxed"
                />
              </div>

              {/* SECTION 4: CTA */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {t.sectionCTA}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">{toPersianDigits(currentScript.sections.cta.trim() ? currentScript.sections.cta.trim().split(/\s+/).length : 0, digitConv)} {language === 'fa' ? 'کلمه' : 'words'}</span>
                </div>
                <textarea
                  value={currentScript.sections.cta}
                  onChange={(e) => handleSectionChange('cta', e.target.value)}
                  placeholder={language === 'fa' ? 'دعوت به لایک، سابسکرایب، یا معرفی ویدیوی مکمل بعدی بر روی صفحه پایانی کانال...' : 'Call to Action. Guide the viewer to click the next supplementary video on screen.'}
                  className="w-full h-24 bg-zinc-50/50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:bg-white dark:focus:bg-[#0c0c0e] focus:ring-1 focus:ring-red-600 transition-all leading-relaxed"
                />
              </div>

              {/* SECTION 5: OUTRO */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {t.sectionOutro}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">{toPersianDigits(currentScript.sections.outro.trim() ? currentScript.sections.outro.trim().split(/\s+/).length : 0, digitConv)} {language === 'fa' ? 'کلمه' : 'words'}</span>
                </div>
                <textarea
                  value={currentScript.sections.outro}
                  onChange={(e) => handleSectionChange('outro', e.target.value)}
                  placeholder={language === 'fa' ? 'حرف‌های پایانی، تشکر و آرزوی موفقیت برای بیننده...' : 'Final thoughts. A memorable, concise send-off.'}
                  className="w-full h-24 bg-zinc-50/50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:bg-white dark:focus:bg-[#0c0c0e] focus:ring-1 focus:ring-red-600 transition-all leading-relaxed"
                />
              </div>
            </div>

          </div>

          {/* Right Metrics & Version History Panel */}
          <div className="space-y-6">
            
            {/* Live Metrics Widget */}
            <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {language === 'fa' ? 'سنجه‌های زنده سناریو' : 'Live Script Performance'}
              </h3>

              <div className="space-y-4 font-mono">
                {/* Total Word Count */}
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span>{t.wordCount}</span>
                  </div>
                  <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-100">
                    {toPersianDigits(currentScript.wordCount, digitConv)}
                  </span>
                </div>

                {/* Live Estimated Runtime */}
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>{t.estRuntime}</span>
                  </div>
                  <span className="font-extrabold text-sm text-red-500">
                    {formatRuntime(currentScript.estimatedRuntime)}
                  </span>
                </div>

                {/* Speak WPM Slider gauge */}
                <div className="space-y-1.5 p-3.5 bg-zinc-50 dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-red-500" />
                      <span>{t.speakingPace}</span>
                    </div>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      {toPersianDigits(wpm, digitConv)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="220"
                    value={wpm}
                    onChange={(e) => setWpm(Number(e.target.value))}
                    className="w-full accent-red-600 bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-zinc-400">
                    <span>{toPersianDigits(100, digitConv)} ({language === 'fa' ? 'شمرده' : 'Slow'})</span>
                    <span>{toPersianDigits(220, digitConv)} ({language === 'fa' ? 'سریع' : 'Fast'})</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Version Control Panel */}
            <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-red-500" />
                  {t.versionHistory}
                </h3>
                <span className="text-[10px] bg-red-950/20 text-red-500 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  {toPersianDigits(currentScript.history?.length || 0, digitConv)}
                </span>
              </div>

              {/* Version List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {!currentScript.history || currentScript.history.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-6">
                    {language === 'fa' ? 'تاکنون هیچ نسخه‌ای ذخیره نشده است.' : 'No version snapshots yet.'}
                  </p>
                ) : (
                  currentScript.history.map((version) => (
                    <div 
                      key={version.id} 
                      className="p-3 bg-zinc-50 dark:bg-[#121214] rounded-xl border border-zinc-200 dark:border-zinc-800/50 text-xs flex flex-col justify-between gap-2.5 hover:border-red-600 dark:hover:border-zinc-700 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[10px] font-mono">
                          {toPersianDigits(new Date(version.timestamp).toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), digitConv)}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {toPersianDigits(version.wordCount, digitConv)} {language === 'fa' ? 'کلمه' : 'words'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => triggerRestoreVersion(version.id)}
                        className="bg-zinc-200 hover:bg-red-600 hover:text-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {t.restore}
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={triggerSaveVersion}
                className="w-full border border-dashed border-red-500/40 hover:border-red-600 text-red-500 hover:text-white hover:bg-red-600 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                {language === 'fa' ? 'ثبت نسخه جدید (Snapshot)' : 'Capture Current Version'}
              </button>

            </div>

            {/* Quick checklist summary of connected idea */}
            {currentIdea && currentIdea.checklist.length > 0 && (
              <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {language === 'fa' ? 'کارهای در حال انجام ویدیو' : 'Video Tasks Pending'}
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {currentIdea.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.completed ? 'bg-zinc-300' : 'bg-red-600'}`} />
                      <span className={`truncate ${item.completed ? 'line-through text-zinc-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
