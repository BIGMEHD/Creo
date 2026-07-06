import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { translations } from './i18n';
import HomeDashboard from './modules/dashboard/HomeDashboard';
import IdeaVault from './modules/ideas/IdeaVault';
import ScriptWriter from './modules/scripts/ScriptWriter';
import ChannelAnalytics from './modules/analytics/ChannelAnalytics';
import ContentCalendar from './modules/calendar/ContentCalendar';
import GoalTracker from './modules/goals/GoalTracker';
import SettingsManager from './modules/settings/SettingsManager';
import BrandLogo from './components/BrandLogo';

import { 
  Tv, 
  Sparkles, 
  FolderOpen, 
  FileText, 
  BarChart4, 
  Calendar, 
  Trophy, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  Globe, 
  Sun, 
  Moon,
  Home
} from 'lucide-react';

type TabId = 'dashboard' | 'ideas' | 'scripts' | 'analytics' | 'calendar' | 'goals' | 'settings';

export default function App() {
  const { language, setLanguage, theme, setTheme } = useStore();
  const t = translations[language];
  const isRtl = language === 'fa';

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync theme selection with document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sidebar navigation menu items
  const menuItems: { id: TabId; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'dashboard', label: t.dashboard, icon: Home },
    { id: 'ideas', label: t.ideaVault, icon: FolderOpen },
    { id: 'scripts', label: t.scriptWriter, icon: FileText },
    { id: 'analytics', label: t.analytics, icon: BarChart4 },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'goals', label: t.goals, icon: Trophy },
    { id: 'settings', label: t.settings, icon: SettingsIcon },
  ];

  const handleNavClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HomeDashboard />;
      case 'ideas':
        return (
          <IdeaVault 
            onNavigateToScript={(ideaId) => {
              setActiveIdeaId(ideaId);
              setActiveTab('scripts');
            }} 
          />
        );
      case 'scripts':
        return (
          <ScriptWriter 
            activeIdeaId={activeIdeaId} 
            onSelectIdea={(id) => setActiveIdeaId(id)} 
          />
        );
      case 'analytics':
        return <ChannelAnalytics />;
      case 'calendar':
        return <ContentCalendar />;
      case 'goals':
        return <GoalTracker />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 font-sans text-zinc-800 bg-zinc-50 dark:bg-[#09090b] dark:text-zinc-100 ${isRtl ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* Mobile Top Header Bar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0c0c0e] border-b border-zinc-150 dark:border-zinc-800 z-30">
        <div className="flex items-center gap-2">
          <BrandLogo className="w-8 h-8" />
          <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.appName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Lang Switch */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'fa' : 'en')}
            className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Quick Theme Switch */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            title="Switch Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Menu Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/55 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className={`fixed top-0 bottom-0 w-60 bg-white dark:bg-[#0c0c0e] p-5 shadow-2xl space-y-6 z-50 transition-all border-zinc-100 dark:border-zinc-800 border-r ${isRtl ? 'right-0' : 'left-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-extrabold text-base tracking-tight uppercase">{t.appName}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'}`}
                    style={isRtl ? { textAlign: 'right', flexDirection: 'row-reverse' } : {}}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Creator Credit Footer (Mobile) */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <span className="block mb-1 opacity-75">{language === 'fa' ? 'طراحی شده توسط' : 'Created by'}</span>
              <a 
                href="https://youtube.com/@BigmehD-XD" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-600 dark:text-red-500 hover:underline font-extrabold tracking-tight"
              >
                BigmehD
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP PERSISTENT NAVIGATION SIDEBAR */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white dark:bg-[#0c0c0e] border-zinc-200 dark:border-zinc-800 p-6 space-y-6 select-none z-10"
             style={{ borderLeftWidth: isRtl ? '1px' : '0px', borderRightWidth: isRtl ? '0px' : '1px' }}>
        
        {/* Sidebar Brand Logo */}
        <div className={`flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <BrandLogo className="w-9 h-9" />
          <div>
            <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 block uppercase">
              {t.appName}
            </span>
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">
              {language === 'fa' ? 'مدیریت آفلاین محتوا' : 'Content Management'}
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-zinc-150 dark:bg-zinc-800/50 text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850/50'}`}
                style={isRtl ? { flexDirection: 'row-reverse' } : {}}
              >
                <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Language / Theme bar footer */}
        <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
          
          {/* Theme Quick Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 transition-all flex items-center justify-center"
            title={t.theme}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Language Switch badge */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'fa' : 'en')}
            className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase"
          >
            <Globe className="w-4 h-4 text-red-600" />
            <span>{language === 'en' ? 'FA' : 'EN'}</span>
          </button>

        </div>

        {/* Creator Credit Badge (Desktop) */}
        <div className="pt-3 border-t border-zinc-150 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500 font-mono">
          <span className="text-[10px] uppercase tracking-wider block mb-1 opacity-75">
            {language === 'fa' ? 'طراحی شده توسط' : 'Created by'}
          </span>
          <a 
            href="https://youtube.com/@BigmehD-XD" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-red-600 dark:text-red-500 hover:underline font-extrabold text-sm tracking-tight"
          >
            BigmehD
          </a>
        </div>

      </aside>

      {/* MAIN CONTAINER CONTENT VIEWPORT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scrollbar-thin">
        <div className="max-w-7xl mx-auto">
          {renderActiveModule()}
        </div>
      </main>

    </div>
  );
}
