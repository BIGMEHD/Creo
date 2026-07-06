import React, { useState } from 'react';
import { useStore } from '../../store';
import { translations, toPersianDigits } from '../../i18n';
import { 
  Settings, 
  Globe, 
  Sun, 
  Moon, 
  Sliders, 
  FolderHeart, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

export default function SettingsManager() {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    wpm, 
    setWpm, 
    series, 
    addSeries, 
    deleteSeries,
    importBackup,
    resetStore
  } = useStore();

  const t = translations[language];
  const isRtl = language === 'fa';
  const digitConv = language === 'fa';

  // State Management
  const [newSeriesName, setNewSeriesName] = useState('');
  const [newSeriesDesc, setNewSeriesDesc] = useState('');
  const [newSeriesColor, setNewSeriesColor] = useState('#dc2626');
  
  const [importStr, setImportStr] = useState('');
  const [backupMsg, setBackupMsg] = useState('');

  // Series submit
  const handleCreateSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeriesName.trim()) return;

    addSeries({
      name: newSeriesName,
      description: newSeriesDesc,
      color: newSeriesColor,
    });

    setNewSeriesName('');
    setNewSeriesDesc('');
    setNewSeriesColor('#dc2626');
  };

  // Export copy
  const handleExport = () => {
    const storeState = useStore.getState();
    const backupObj = {
      language: storeState.language,
      theme: storeState.theme,
      wpm: storeState.wpm,
      ideas: storeState.ideas,
      scripts: storeState.scripts,
      series: storeState.series,
      statsHistory: storeState.statsHistory,
      currentStats: storeState.currentStats,
      videosPerformance: storeState.videosPerformance,
      goals: storeState.goals,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `creo_youtube_backup_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    // Copy backup string also to clipboard
    navigator.clipboard.writeText(JSON.stringify(backupObj, null, 2));

    setBackupMsg(t.exportSuccess);
    setTimeout(() => setBackupMsg(''), 4000);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importStr.trim()) return;

    try {
      const parsed = JSON.parse(importStr);
      const success = importBackup(parsed);
      if (success) {
        setBackupMsg(t.importSuccess);
        setImportStr('');
        setTimeout(() => setBackupMsg(''), 4000);
      } else {
        alert(language === 'fa' ? 'فرمت فایل وارد شده پشتیبانی نمی‌شود!' : 'Invalid backup JSON file structure!');
      }
    } catch (err) {
      alert(language === 'fa' ? 'داده نامعتبر است. فرمت فایل باید JSON معتبر باشد.' : 'Failed to parse JSON. Please make sure the structure is correct.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-red-600" />
          {t.settings}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {language === 'fa' ? 'شخصی‌سازی زبان و پوسته، پیکربندی فرکانس سناریونویسی و مدیریت ستون‌های محتوایی' : 'Fine-tune settings, configure word pace, and control content pillars.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Column 1: Preferences & Backup */}
        <div className="space-y-6">
          
          {/* Theme & Language Preferences Card */}
          <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-6 space-y-5">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-800 pb-2">
              {language === 'fa' ? 'تنظیمات عمومی کاربری' : 'General Settings'}
            </h3>

            {/* Language Selection */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-red-500" />
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">{t.language}</span>
                  <span className="text-[10px] text-zinc-400 block">{language === 'fa' ? 'انتخاب جهت چپ‌به‌راست و راست‌به‌چپ' : 'Select English LTR or Persian RTL'}</span>
                </div>
              </div>

              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                <button
                  onClick={() => setLanguage('en')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-500 shadow-xs' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('fa')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${language === 'fa' ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-500 shadow-xs' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  فارسی
                </button>
              </div>
            </div>

            {/* Theme Toggle Selection */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-150 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-red-500" /> : <Sun className="w-5 h-5 text-red-500" />}
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">{t.theme}</span>
                  <span className="text-[10px] text-zinc-400 block">{language === 'fa' ? 'تغییر تم تمیز نرم‌افزار' : 'Adjust UI visibility colors'}</span>
                </div>
              </div>

              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                <button
                  onClick={() => setTheme('light')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-500 shadow-xs' : 'text-zinc-400'}`}
                >
                  {t.lightMode}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-500 shadow-xs' : 'text-zinc-400'}`}
                >
                  {t.darkMode}
                </button>
              </div>
            </div>

            {/* WPM Pace speed indicator */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-150 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-red-500" />
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">{t.wpmLabel}</span>
                  <span className="text-[10px] text-zinc-400 block">{language === 'fa' ? 'سرعت متوسط خواندن متون (کلمه در دقیقه)' : 'Words per minute pacing'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={wpm}
                  onChange={(e) => setWpm(Number(e.target.value))}
                  className="w-20 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-center font-bold font-mono text-xs text-zinc-800 dark:text-zinc-100 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

          </div>

          {/* Backup & Local Export / Import Card */}
          <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              {t.backupDatabase}
            </h3>

            <p className="text-[10px] text-zinc-400 leading-relaxed">
              {language === 'fa' 
                ? 'با کلیک بر روی دکمه خروجی، کل دیتابیس لوکال نرم‌افزار به صورت یک فایل متنی JSON پشتیبان دانلود می‌شود. همچنین می‌توانید داده‌های ذخیره شده را بازیابی کنید.'
                : 'Download your entire local database schema as a single JSON backup. Copy or save it safely to restore later.'}
            </p>

            {backupMsg && (
              <div className="p-3 bg-red-950/20 text-red-500 rounded-xl text-xs font-bold border border-red-900/20">
                {backupMsg}
              </div>
            )}

            <button
              onClick={handleExport}
              className="w-full bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border border-zinc-200 dark:border-zinc-700"
            >
              <Download className="w-4 h-4" />
              {t.exportData}
            </button>

            {/* Import form */}
            <form onSubmit={handleImport} className="space-y-2 pt-3 border-t border-zinc-150 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">
                {t.importData}
              </span>
              <textarea
                placeholder={language === 'fa' ? 'داده‌های پشتیبان (JSON) را در این کادر پیست کنید...' : 'Paste backup JSON string here...'}
                value={importStr}
                onChange={(e) => setImportStr(e.target.value)}
                className="w-full h-24 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl p-3 text-xs text-zinc-800 dark:text-zinc-100 resize-none font-mono focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-900/10 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {t.importData}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                if (confirm(language === 'fa' ? 'آیا از پاک کردن کامل کل داده‌ها و بازگشت به تنظیمات کارخانه مطمئن هستید؟' : 'Are you sure you want to reset the store and restore mock seed data?')) {
                  resetStore();
                }
              }}
              className="w-full text-red-500 hover:underline text-xs text-center pt-2 font-bold cursor-pointer"
            >
              {language === 'fa' ? 'پاک‌سازی کامل دیتابیس محلی (Reset)' : 'Factory Reset Local Database'}
            </button>

          </div>

        </div>

        {/* Column 2: Content Pillars / Series Manager */}
        <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-red-500" />
              {t.pillarsAndSeries}
            </h3>
            <span className="bg-red-950/20 text-red-500 border border-red-900/20 text-xs px-2.5 py-0.5 rounded-full font-bold font-mono">
              {toPersianDigits(series.length, digitConv)}
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed">
            {language === 'fa' 
              ? 'ستون‌های محتوایی به شما کمک می‌کنند ایده‌های ویدیویی را در دسته‌بندی‌های مشخص سازماندهی کنید تا همواره تعادل موضوعی را در کانال خود حفظ کنید.'
              : 'Content pillars organize topics to prevent coverage gaps. Color-code series to recognize content types instantly.'}
          </p>

          {/* Series List */}
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {series.map(s => (
              <div 
                key={s.id} 
                className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: s.color }} />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 block">
                      {s.name.split(' / ')[language === 'fa' ? 1 : 0]}
                    </span>
                    {s.description && (
                      <span className="text-[10px] text-zinc-400 block mt-0.5">{s.description}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteSeries(s.id)}
                  className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
                  title={t.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Create Series Form */}
          <form onSubmit={handleCreateSeries} className="space-y-3 pt-3 border-t border-zinc-150 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 block">
              {t.createSeries}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={t.seriesName}
                value={newSeriesName}
                onChange={(e) => setNewSeriesName(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Technical Tutorials"
                  value={newSeriesDesc}
                  onChange={(e) => setNewSeriesDesc(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 flex-1 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                />
                <input
                  type="color"
                  value={newSeriesColor}
                  onChange={(e) => setNewSeriesColor(e.target.value)}
                  className="w-10 h-8 rounded-lg cursor-pointer border-none bg-zinc-100 dark:bg-zinc-800 p-0.5"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-900/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t.add}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
