import React, { useState } from 'react';
import { useStore } from '../../store';
import { translations, toPersianDigits } from '../../i18n';
import { VideoPerformance } from '../../types';
import { 
  TrendingUp, 
  Tv, 
  Users, 
  DollarSign, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  BarChart4, 
  Heart, 
  MessageSquare,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';

export default function ChannelAnalytics() {
  const { 
    language, 
    currentStats, 
    videosPerformance, 
    ideas, 
    addVideoPerformance, 
    updateChannelStats 
  } = useStore();

  const t = translations[language];
  const isRtl = language === 'fa';
  const digitConv = language === 'fa';

  // Popups State
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isUpdateStatsOpen, setIsUpdateStatsOpen] = useState(false);

  // Form state for video stats
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState('');
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [watchTime, setWatchTime] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [targetViews, setTargetViews] = useState<number>(0);

  // Form state for channel update
  const [newSubs, setNewSubs] = useState<number>(currentStats.subscribers);
  const [newTotalViews, setNewTotalViews] = useState<number>(currentStats.totalViews);
  const [newWatch, setNewWatch] = useState<number>(currentStats.totalWatchTime);
  const [newRev, setNewRev] = useState<number>(currentStats.totalRevenue);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    addVideoPerformance({
      ideaId: selectedIdeaId || null,
      title: videoTitle,
      publishDate: new Date().toISOString().substring(0, 10), // today
      views,
      likes,
      comments,
      watchTime,
      revenue,
      targetViews,
    });

    // Reset Form
    setSelectedIdeaId('');
    setVideoTitle('');
    setViews(0);
    setLikes(0);
    setComments(0);
    setWatchTime(0);
    setRevenue(0);
    setTargetViews(0);
    setIsLogOpen(false);
  };

  const handleUpdateStatsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateChannelStats({
      subscribers: newSubs,
      totalViews: newTotalViews,
      totalWatchTime: newWatch,
      totalRevenue: newRev,
    });
    setIsUpdateStatsOpen(false);
  };

  const handleIdeaSelect = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    if (ideaId) {
      const idea = ideas.find(i => i.id === ideaId);
      if (idea) {
        setVideoTitle(idea.title);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Analytics Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart4 className="w-6 h-6 text-red-600" />
            {t.analyticsDashboard}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {language === 'fa' ? 'ارزیابی مستمر عملکرد ویدیوها، بازدید هدف در مقابل واقعی و برآورد آمار درآمدی کانال' : 'Track and audit your channel metrics side-by-side with goals.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={() => setIsUpdateStatsOpen(true)}
            className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-zinc-200 dark:border-zinc-800"
          >
            {t.updateStats}
          </button>
          <button
            onClick={() => setIsLogOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-900/10"
          >
            <Plus className="w-4 h-4" />
            {t.addVideoStats}
          </button>
        </div>
      </div>

      {/* Core Stats Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{t.subscribers}</span>
            <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 p-1.5 rounded-lg"><Users className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 font-mono tracking-tight">
              {toPersianDigits(currentStats.subscribers.toLocaleString(), digitConv)}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-medium">{t.manualStatsEntry}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{t.totalViews}</span>
            <span className="bg-zinc-100 dark:bg-zinc-900/50 text-zinc-650 dark:text-zinc-300 p-1.5 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 font-mono tracking-tight">
              {toPersianDigits(currentStats.totalViews.toLocaleString(), digitConv)}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-medium">{t.manualStatsEntry}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{t.watchTimeHours}</span>
            <span className="bg-zinc-100 dark:bg-zinc-900/50 text-zinc-650 dark:text-zinc-300 p-1.5 rounded-lg"><Tv className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 font-mono tracking-tight">
              {toPersianDigits(currentStats.totalWatchTime.toLocaleString(), digitConv)}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-medium">{t.manualStatsEntry}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{t.revenue}</span>
            <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 p-1.5 rounded-lg"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 font-mono tracking-tight">
              ${toPersianDigits(currentStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }), digitConv)}
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-medium">{t.manualStatsEntry}</span>
          </div>
        </div>
      </div>

      {/* Planned vs Actual grid comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Video Performance Cards (Planned vs Actual analysis) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-6 space-y-4">
          <h3 className="font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {t.plannedVsActual}
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {videosPerformance.map((perf) => {
              const performanceDiff = perf.views - perf.targetViews;
              const hasBeatenTarget = performanceDiff >= 0;
              
              return (
                <div 
                  key={perf.id} 
                  className="bg-zinc-50 dark:bg-[#121214] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-red-600 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold px-2 py-0.5 rounded-sm inline-block uppercase font-mono">
                      {perf.id}
                    </span>
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 truncate mt-1">
                      {perf.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400 mt-1.5 font-sans">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {toPersianDigits(perf.publishDate, digitConv)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500" />
                        {toPersianDigits(perf.likes.toLocaleString(), digitConv)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                        {toPersianDigits(perf.comments.toLocaleString(), digitConv)}
                      </span>
                    </div>
                  </div>

                  {/* Planned vs Actual Stats panel side-by-side */}
                  <div className="flex items-center gap-4 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800/80 pt-3 sm:pt-0 w-full sm:w-auto self-stretch sm:self-auto justify-between">
                    
                    {/* View comparison values */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">{language === 'fa' ? 'بازدید واقعی' : 'Actual views'}</span>
                        <span className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">
                          {toPersianDigits(perf.views.toLocaleString(), digitConv)}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">{language === 'fa' ? 'تارگت (هدف)' : 'Target views'}</span>
                        <span className="text-xs font-bold font-mono text-zinc-400">
                          {toPersianDigits(perf.targetViews.toLocaleString(), digitConv)}
                        </span>
                      </div>
                    </div>

                    {/* Performance Flag banner */}
                    <div className={`p-2.5 rounded-xl flex items-center justify-center ${hasBeatenTarget ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-400'}`}>
                      {hasBeatenTarget ? (
                        <CheckCircle2 className="w-5 h-5" title={t.excellent} />
                      ) : (
                        <AlertCircle className="w-5 h-5" title={t.underperformed} />
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right list: Top Performing Videos */}
        <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {t.topPerformingVideos}
            </h3>
            <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
          </div>

          <div className="space-y-4">
            {videosPerformance
              .slice()
              .sort((a, b) => b.views - a.views)
              .map((perf, index) => (
                <div key={perf.id} className="flex items-center gap-3.5 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="font-mono text-xs font-extrabold text-red-500/80">
                    #{toPersianDigits(index + 1, digitConv)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 truncate">
                      {perf.title}
                    </h4>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {toPersianDigits(perf.views.toLocaleString(), digitConv)} views • ${toPersianDigits(perf.revenue.toLocaleString(), digitConv)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* UPDATE CHANNEL STATS MODAL */}
      {isUpdateStatsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0c0c0e] w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {t.updateStats}
              </h3>
              <button onClick={() => setIsUpdateStatsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">{t.subscribers}</label>
                <input
                  type="number"
                  value={newSubs}
                  onChange={(e) => setNewSubs(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">{t.totalViews}</label>
                <input
                  type="number"
                  value={newTotalViews}
                  onChange={(e) => setNewTotalViews(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">{t.watchTimeHours}</label>
                  <input
                    type="number"
                    value={newWatch}
                    onChange={(e) => setNewWatch(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500">{t.revenue}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRev}
                    onChange={(e) => setNewRev(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateStatsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 rounded-xl transition-all"
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

      {/* LOG VIDEO STATS MODAL */}
      {isLogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0c0c0e] w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {t.addVideoStats}
              </h3>
              <button onClick={() => setIsLogOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4">
              {/* Optional Idea link */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{language === 'fa' ? 'اتصال به ایده موجود (اختیاری):' : 'Link to existing Idea (Optional):'}</label>
                <select
                  value={selectedIdeaId}
                  onChange={(e) => handleIdeaSelect(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600 cursor-pointer"
                >
                  <option value="">{t.none}</option>
                  {ideas.map(i => (
                    <option key={i.id} value={i.id}>{i.title}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.title} *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{language === 'fa' ? 'بازدید واقعی' : 'Actual views'}</label>
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.targetViews}</label>
                  <input
                    type="number"
                    value={targetViews}
                    onChange={(e) => setTargetViews(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.likes}</label>
                  <input
                    type="number"
                    value={likes}
                    onChange={(e) => setLikes(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.comments}</label>
                  <input
                    type="number"
                    value={comments}
                    onChange={(e) => setComments(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.watchTimeHours}</label>
                  <input
                    type="number"
                    value={watchTime}
                    onChange={(e) => setWatchTime(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{t.revenue} ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 rounded-xl transition-all"
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

    </div>
  );
}
