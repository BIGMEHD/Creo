import React, { useState } from 'react';
import { useStore } from '../../store';
import { translations, toPersianDigits } from '../../i18n';
import { 
  Users, 
  TrendingUp, 
  Tv, 
  DollarSign, 
  Flame, 
  Calendar, 
  ArrowUpRight, 
  Plus, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function HomeDashboard() {
  const { 
    language, 
    currentStats, 
    statsHistory, 
    ideas, 
    goals, 
    videosPerformance,
    addIdea,
    updateChannelStats
  } = useStore();

  const t = translations[language];
  const isRtl = language === 'fa';
  const digitConv = language === 'fa';

  const [newTitle, setNewTitle] = useState('');
  const [newHook, setNewHook] = useState('');

  // Find next scheduled video
  const nextScheduledVideo = ideas
    .filter(i => i.scheduledDate && i.status !== 'published' && i.status !== 'archived')
    .sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''))[0];

  // Active consistency goal/streak
  const uploadGoal = goals.find(g => g.category === 'uploads');
  const activeStreak = uploadGoal?.streakDays ?? 0;

  // Last uploaded video performance
  const lastPublishedVideo = videosPerformance[0];

  // Quick add submit handler
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    addIdea({
      title: newTitle,
      hook: newHook,
      priority: 'hot',
      status: 'idea',
      tags: [],
      notes: '',
      links: [],
      thumbnailUrl: null,
      seriesId: null,
      scheduledDate: null,
    });
    
    setNewTitle('');
    setNewHook('');
  };

  // Generate automated channel review & strategy critique
  const generateWeeklyAnalysis = () => {
    const totalSubs = currentStats.subscribers;
    const views = currentStats.totalViews;
    const recentUploadCount = ideas.filter(i => i.status === 'published').length;
    
    if (language === 'en') {
      return {
        rating: 'Strong Momentum',
        critique: `Your channel is showing solid engagement with a subscriber base of ${totalSubs.toLocaleString()}. Your recent video "${lastPublishedVideo?.title || 'No recent upload'}" got ${lastPublishedVideo?.views.toLocaleString() || '0'} views, performing ${lastPublishedVideo && lastPublishedVideo.views >= lastPublishedVideo.targetViews ? 'above' : 'below'} the expected baseline of ${lastPublishedVideo?.targetViews.toLocaleString() || '0'}.`,
        recommendation: `1. **Consistency Checklist**: Keep up your current upload cadence. You have ${ideas.filter(i => i.status === 'scripting').length} videos in the script pipeline.\n2. **High Priority Pillar**: We recommend focusing on "${initialPillarSuggestion()}" series, which has driven high CTR.\n3. **SEO optimization**: Expand description boxes and inject high-intent tags to lock in search rank.`
      };
    } else {
      return {
        rating: 'رشد تصاعدی و مطلوب',
        critique: `کانال شما با مجموع ${toPersianDigits(totalSubs.toLocaleString(), true)} سابسکرایبر در مسیر رشد مطلوبی قرار دارد. ویدیوی اخیر شما با عنوان «${lastPublishedVideo?.title || 'ویدیویی ثبت نشده'}» توانسته ${toPersianDigits(lastPublishedVideo?.views.toLocaleString() || 0, true)} بازدید ثبت کند که ${lastPublishedVideo && lastPublishedVideo.views >= lastPublishedVideo.targetViews ? 'بالاتر' : 'پایین‌تر'} از تارگت فرضی شما (${toPersianDigits(lastPublishedVideo?.targetViews.toLocaleString() || 0, true)} بازدید) است.`,
        recommendation: `۱. **تمرکز بر سناریونویسی**: در حال حاضر ${toPersianDigits(ideas.filter(i => i.status === 'scripting').length, true)} ویدیو در مرحله نگارش دارید؛ سریع‌تر آن‌ها را تکمیل کنید.\n۲. **کاور ویدیو**: طبق بررسی‌های آماری، تضاد رنگی کاورها نقش مهمی در جذب مخاطب داشته است.\n۳. **تعامل مخاطبان**: در ۵ دقیقه اول انتشار ویدیو به تمامی کامنت‌ها پاسخ دهید.`
      };
    }
  };

  const initialPillarSuggestion = () => {
    return "Coding Tutorials";
  };

  const analysis = generateWeeklyAnalysis();

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.appName}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t.tagline} • {new Date().toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        {/* Quick actions or Stats edit */}
        <div className="flex items-center gap-3">
          <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-mono">
            {t.theme}: <span className="font-semibold text-sky-500">{t.darkMode}</span>
          </div>
        </div>
      </div>

      {/* Main Core Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider font-bold">{t.subscribers}</span>
            <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 font-sans tracking-tight">
              {toPersianDigits(currentStats.subscribers.toLocaleString(), digitConv)}
            </span>
          </div>
          <div className="bg-red-500/10 text-red-500 p-2.5 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider font-bold">{t.totalViews}</span>
            <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 font-sans tracking-tight">
              {toPersianDigits(currentStats.totalViews.toLocaleString(), digitConv)}
            </span>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 p-2.5 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider font-bold">{t.watchTimeHours}</span>
            <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 font-sans tracking-tight">
              {toPersianDigits(currentStats.totalWatchTime.toLocaleString(), digitConv)}
            </span>
          </div>
          <div className="bg-indigo-500/10 text-indigo-500 p-2.5 rounded-xl">
            <Tv className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block uppercase tracking-wider font-bold">{t.revenue}</span>
            <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 font-sans tracking-tight">
              ${toPersianDigits(currentStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }), digitConv)}
            </span>
          </div>
          <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Stats Dashboard Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Quick Stats Widget */}
        <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {t.quickStats}
          </h3>
          
          <div className="space-y-3.5">
            {/* Streak Widget */}
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-900/30">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider block">
                  {t.uploadStreak}
                </span>
                <span className="text-base font-bold text-zinc-800 dark:text-zinc-100 font-sans tracking-tight">
                  {toPersianDigits(activeStreak, digitConv)} {language === 'fa' ? 'روز پیوسته' : 'Days Streak'}
                </span>
              </div>
            </div>

            {/* Next Scheduled Video Widget */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl flex items-center gap-3 border border-zinc-200 dark:border-zinc-850">
              <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 p-2 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                  {t.nextScheduled}
                </span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate block mt-0.5">
                  {nextScheduledVideo ? nextScheduledVideo.title : t.none}
                </span>
                {nextScheduledVideo?.scheduledDate && (
                  <span className="text-xs text-zinc-500 block font-sans mt-0.5">
                    {toPersianDigits(nextScheduledVideo.scheduledDate, digitConv)}
                  </span>
                )}
              </div>
            </div>

            {/* Last Video Performance */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl flex items-center gap-3 border border-zinc-200 dark:border-zinc-850">
              <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 p-2 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                  {t.lastVideoPerf}
                </span>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate block mt-0.5">
                  {lastPublishedVideo ? lastPublishedVideo.title : t.none}
                </span>
                <div className="flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-500 font-sans mt-1">
                  <span>{toPersianDigits(lastPublishedVideo?.views?.toLocaleString() || 0, digitConv)} {language === 'fa' ? 'بازدید' : 'views'}</span>
                  <span>•</span>
                  <span>{toPersianDigits(lastPublishedVideo?.likes?.toLocaleString() || 0, digitConv)} 👍</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center column: Beautiful Stylized SVG Growth Chart */}
        <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              {t.subscribersOverTime}
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {language === 'fa' ? 'روند ۴ ماه گذشته' : 'Growth over the last 4 months'}
            </span>
          </div>

          {/* Crafted SVG Chart */}
          <div className="h-44 w-full mt-4 relative">
            <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="10" y1="20" x2="390" y2="20" stroke="#e2e8f0" className="dark:stroke-zinc-800/60" strokeDasharray="3" />
              <line x1="10" y1="70" x2="390" y2="70" stroke="#e2e8f0" className="dark:stroke-zinc-800/60" strokeDasharray="3" />
              <line x1="10" y1="120" x2="390" y2="120" stroke="#e2e8f0" className="dark:stroke-zinc-800/60" strokeDasharray="3" />

              {/* Chart Line with Area fill */}
              {/* Points for 18.4k, 20.1k, 22.3k, 24.1k: mapped on 0-400 x 0-160 */}
              <path
                d="M 20 130 Q 120 110 130 100 T 240 70 T 380 40 L 380 140 L 20 140 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 20 130 Q 120 110 130 100 T 240 70 T 380 40"
                fill="none"
                stroke="#dc2626"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Plot Dots */}
              <circle cx="20" cy="130" r="4.5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
              <circle cx="130" cy="100" r="4.5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
              <circle cx="240" cy="70" r="4.5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
              <circle cx="380" cy="40" r="4.5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />

              {/* Labels */}
              <text x="20" y="155" fill="#71717a" fontSize="10" textAnchor="middle" className="font-sans">
                {language === 'fa' ? 'اسفند' : 'Mar'}
              </text>
              <text x="130" y="155" fill="#71717a" fontSize="10" textAnchor="middle" className="font-sans">
                {language === 'fa' ? 'فروردین' : 'Apr'}
              </text>
              <text x="240" y="155" fill="#71717a" fontSize="10" textAnchor="middle" className="font-sans">
                {language === 'fa' ? 'اردیبهشت' : 'May'}
              </text>
              <text x="380" y="155" fill="#71717a" fontSize="10" textAnchor="middle" className="font-sans">
                {language === 'fa' ? 'خرداد' : 'Jun'}
              </text>

              {/* Value bubbles */}
              <text x="30" y="115" fill="#71717a" fontSize="9" fontWeight="bold" className="font-sans">
                {toPersianDigits('18.4k', digitConv)}
              </text>
              <text x="350" y="28" fill="#71717a" fontSize="9" fontWeight="bold" className="font-sans">
                {toPersianDigits('24.1k', digitConv)}
              </text>
            </svg>
          </div>
        </div>

        {/* Right column: Quick Capture Idea box */}
        <form onSubmit={handleQuickAdd} className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
              <Sparkles className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-xs uppercase tracking-wider">
                {t.newIdea} (Quick Capture)
              </h3>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t.ideaTitle}
                className="w-full bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white dark:focus:bg-[#0c0c0e] transition-all"
                required
              />
              <textarea
                value={newHook}
                onChange={(e) => setNewHook(e.target.value)}
                placeholder={t.oneLineHook}
                className="w-full h-16 bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:bg-white dark:focus:bg-[#0c0c0e] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-900/10 mt-3"
          >
            <Plus className="w-4 h-4" />
            {t.add}
          </button>
        </form>
      </div>

      {/* Strategy Review Widget & Goals Tracker Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Strategy Critique widget (Offline AI summary) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-800 dark:text-white p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500 dark:text-sky-400 animate-pulse" />
              <h2 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                {t.weeklyReview}
              </h2>
            </div>
            <span className="bg-sky-100/70 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 text-xs px-2.5 py-1 rounded-full font-mono">
              {analysis.rating}
            </span>
          </div>

          <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
            <div className="p-4 bg-zinc-200/40 dark:bg-white/5 border border-zinc-200/60 dark:border-white/10 rounded-xl backdrop-blur-md">
              <span className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider block mb-1">
                {t.autoGeneratedSummary}
              </span>
              <p className="leading-relaxed">
                {analysis.critique}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                {language === 'fa' ? 'توصیه‌های استراتژیک کلیدی' : 'Key Strategic Recommendations'}
              </span>
              <div className="whitespace-pre-line text-xs leading-relaxed bg-amber-50/50 dark:bg-amber-500/5 p-4 rounded-xl border border-amber-200/60 dark:border-amber-500/10 text-zinc-800 dark:text-zinc-200">
                {analysis.recommendation}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Goals progress widgets */}
        <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4 w-full">
            <h3 className="font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-red-500" />
              {t.activeGoals}
            </h3>

            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">{goal.title}</span>
                      <span className="text-zinc-400 font-sans">
                        {toPersianDigits(percent, digitConv)}%
                      </span>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-400 font-sans">
                      <span>{toPersianDigits(goal.currentValue.toLocaleString(), digitConv)}</span>
                      <span>/</span>
                      <span>{toPersianDigits(goal.targetValue.toLocaleString(), digitConv)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 border-t border-zinc-150 dark:border-zinc-800/80 pt-3 text-center mt-4 font-medium">
            {language === 'fa' ? 'قابل همگام‌سازی با یوتیوب استودیو' : 'Ready to sync with YouTube API v3'}
          </div>
        </div>

      </div>

    </div>
  );
}
