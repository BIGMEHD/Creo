import React, { useState } from 'react';
import { useStore } from '../../store';
import { translations, toPersianDigits } from '../../i18n';
import { Goal } from '../../types';
import { 
  Trophy, 
  Plus, 
  Zap, 
  Flame, 
  Calendar, 
  Target, 
  TrendingUp, 
  Sparkles,
  BarChart2,
  Trash2,
  X
} from 'lucide-react';

export default function GoalTracker() {
  const { 
    language, 
    goals, 
    currentStats, 
    addGoal, 
    deleteGoal, 
    updateGoal,
    incrementStreak,
    resetStreak
  } = useStore();

  const t = translations[language];
  const isRtl = language === 'fa';
  const digitConv = language === 'fa';

  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State for new goal
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Goal['category']>('subscribers');
  const [targetValue, setTargetValue] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [deadline, setDeadline] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetValue <= 0) return;

    // Autocomplete current values based on category
    let val = currentValue;
    if (category === 'subscribers') val = currentStats.subscribers;
    if (category === 'views') val = currentStats.totalViews;
    if (category === 'revenue') val = currentStats.totalRevenue;
    if (category === 'watch_time') val = currentStats.totalWatchTime;

    addGoal({
      title,
      category,
      targetValue,
      currentValue: val,
      deadline,
    });

    setTitle('');
    setCategory('subscribers');
    setTargetValue(0);
    setCurrentValue(0);
    setDeadline('');
    setIsAddOpen(false);
  };

  // Find Streak uploads count
  const uploadGoal = goals.find(g => g.category === 'uploads');
  const activeStreak = uploadGoal?.streakDays ?? 0;

  return (
    <div className="space-y-6 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Goal Tracker Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-red-600" />
            {t.goalTracker}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {language === 'fa' ? 'هدف‌گذاری دقیق سابسکرایبر، میزان تولید محتوا، درآمدزایی کانال و ثبت رکوردهای پیوستگی' : 'Outline high-interest milestones, lock in deadlines, and log consistency.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-900/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t.addGoal}
        </button>
      </div>

      {/* Streak and Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Streak Consistency Widget */}
        <div className="bg-gradient-to-br from-red-700 to-red-950 text-white p-5 rounded-3xl shadow-lg border border-red-800/40 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider">{t.uploadStreak}</span>
              <h3 className="text-lg font-extrabold">{t.streakActive}</h3>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl"><Flame className="w-6 h-6 animate-pulse" /></div>
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-extrabold font-mono">{toPersianDigits(activeStreak, digitConv)}</span>
            <span className="text-xs font-semibold text-white/90">{language === 'fa' ? 'روز انتشار مداوم' : 'Consecutive Days'}</span>
          </div>

          {/* Buttons to update streak */}
          <div className="flex gap-2.5 mt-4 pt-4 border-t border-white/10">
            <button 
              onClick={incrementStreak}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg flex-1 transition-all cursor-pointer"
            >
              {language === 'fa' ? '+ ثبت تداوم' : '+ Log Upload'}
            </button>
            <button 
              onClick={resetStreak}
              className="bg-black/10 hover:bg-black/20 text-white/80 font-semibold text-[10px] px-3.5 py-2 rounded-lg transition-all cursor-pointer"
            >
              {language === 'fa' ? 'بازنشانی (Reset)' : 'Reset'}
            </button>
          </div>
        </div>

        {/* AI Auto-Generated Summary Block */}
        <div className="lg:col-span-2 bg-zinc-50 dark:bg-[#121214] text-zinc-800 dark:text-white p-6 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800/60 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100">{t.weeklyReview}</h3>
            </div>
            
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {language === 'fa' 
                ? 'کانال شما به طور مداوم محتواهای باکیفیت و با ساختار سئوی قدرتمند منتشر می‌کند. تارگت سابسکرایبر شما ۳۰ هزار است؛ با حفظ نرخ فعلی تولید محتوا (۲ ویدیو در هفته)، در کمتر از ۴۵ روز به این هدف خواهید رسید.'
                : 'Your Channel exhibits exceptional growth vectors. With a structured release rate of 2 videos per week, you are pacing perfectly to secure your Subscriber goal of 30,000 ahead of your current September deadline.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-400 mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3">
            <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-red-500" /> {language === 'fa' ? '۳ هدف فعال' : '3 Goals Active'}</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-zinc-500" /> {language === 'fa' ? 'عملکرد: ۹۶٪ مطلوب' : 'Pacing efficiency: 96%'}</span>
          </div>
        </div>

      </div>

      {/* Main Milestones Progress Grid */}
      <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 md:p-6 space-y-4">
        <h3 className="font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {t.activeGoals}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-8 md:col-span-2">{t.noGoalsYet}</p>
          ) : (
            goals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              return (
                <div 
                  key={goal.id} 
                  className="bg-zinc-50 dark:bg-[#121214] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-4 group hover:border-red-600 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-red-950/20 text-red-500 border border-red-900/20 font-bold px-2.5 py-0.5 rounded-full font-mono uppercase">
                        {goal.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-100 mt-1">
                        {goal.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 transition-colors cursor-pointer"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress bar track */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-300 font-mono">
                      <span>{toPersianDigits(goal.currentValue.toLocaleString(), digitConv)}</span>
                      <span>{toPersianDigits(percent, digitConv)}%</span>
                      <span>{toPersianDigits(goal.targetValue.toLocaleString(), digitConv)}</span>
                    </div>

                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${goal.achieved ? 'bg-emerald-500' : 'bg-red-600'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono pt-2 border-t border-zinc-150 dark:border-zinc-800/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {toPersianDigits(goal.deadline, digitConv)}
                    </span>
                    {goal.achieved && (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        🏆 {t.completed}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CREATE GOAL MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0c0c0e] w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {t.addGoal}
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Objective */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">{t.goalTitle} *</label>
                <input
                  type="text"
                  placeholder="e.g. Reach 30,000 subscribers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">{t.goalCategory}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Goal['category'])}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="subscribers">{t.subscribers}</option>
                  <option value="views">{t.totalViews}</option>
                  <option value="uploads">{language === 'fa' ? 'تعداد آپلود ویدیوها' : 'Total Uploads'}</option>
                  <option value="revenue">{t.revenue}</option>
                  <option value="watch_time">{t.watchTimeHours}</option>
                </select>
              </div>

              {/* Target Metric */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">{t.targetValue} *</label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500">{t.deadline}</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 rounded-xl transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-900/10 cursor-pointer"
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
