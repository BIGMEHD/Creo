import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Idea, Script, Goal, VideoPerformance, Series, ChannelStats, VideoStatus, Priority } from './types';

interface StoreActions {
  setLanguage: (lang: 'en' | 'fa') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setWpm: (wpm: number) => void;
  
  // Ideas Actions
  addIdea: (idea: Omit<Idea, 'id' | 'checklist' | 'abNotes' | 'keywords' | 'descriptionTemplate'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  moveIdeaStatus: (id: string, newStatus: VideoStatus) => void;
  
  // Checklist Actions
  addChecklistItem: (ideaId: string, text: string) => void;
  toggleChecklistItem: (ideaId: string, itemId: string) => void;
  deleteChecklistItem: (ideaId: string, itemId: string) => void;
  
  // Script Actions
  updateScript: (ideaId: string, sections: Partial<Script['sections']>) => void;
  saveScriptVersion: (ideaId: string) => void;
  restoreScriptVersion: (ideaId: string, versionId: string) => void;
  
  // Analytics Actions
  addVideoPerformance: (perf: Omit<VideoPerformance, 'id'>) => void;
  updateVideoPerformance: (id: string, updates: Partial<VideoPerformance>) => void;
  deleteVideoPerformance: (id: string) => void;
  updateChannelStats: (stats: Partial<ChannelStats>) => void;
  
  // Goals Actions
  addGoal: (goal: Omit<Goal, 'id' | 'achieved'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  
  // Series Actions
  addSeries: (series: Omit<Series, 'id'>) => void;
  deleteSeries: (id: string) => void;
  
  // Import/Export
  importBackup: (backup: any) => boolean;
  resetStore: () => void;
}

// Clean, empty initial states for a production environment where the creator has published the app
const initialSeries: Series[] = [];

const initialIdeas: Idea[] = [];

const initialScripts: { [ideaId: string]: Script } = {};

const initialStatsHistory: any[] = [];

const initialStats: ChannelStats = {
  subscribers: 0,
  totalViews: 0,
  totalWatchTime: 0,
  totalRevenue: 0,
  lastUpdated: new Date().toISOString(),
};

const initialVideosPerformance: VideoPerformance[] = [];

const initialGoals: Goal[] = [];

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      // Default settings
      language: 'en',
      theme: 'dark',
      wpm: 150,
      
      // Core state
      ideas: initialIdeas,
      scripts: initialScripts,
      series: initialSeries,
      statsHistory: initialStatsHistory,
      currentStats: initialStats,
      videosPerformance: initialVideosPerformance,
      goals: initialGoals,

      // Actions
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      setWpm: (wpm) => set({ wpm }),

      // Ideas
      addIdea: (ideaData) => set((state) => {
        const newId = `idea-${Date.now()}`;
        const newIdea: Idea = {
          ...ideaData,
          id: newId,
          checklist: [],
          abNotes: [],
          keywords: [],
          descriptionTemplate: '',
        };
        return { ideas: [newIdea, ...state.ideas] };
      }),

      updateIdea: (id, updates) => set((state) => ({
        ideas: state.ideas.map((idea) => {
          if (idea.id === id) {
            const updated = { ...idea, ...updates };
            // If status changed to published, see if we can update goals or sync back.
            return updated;
          }
          return idea;
        }),
      })),

      deleteIdea: (id) => set((state) => {
        // Also delete linked script
        const updatedScripts = { ...state.scripts };
        delete updatedScripts[id];
        return {
          ideas: state.ideas.filter((idea) => idea.id !== id),
          scripts: updatedScripts,
        };
      }),

      moveIdeaStatus: (id, newStatus) => set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === id ? { ...idea, status: newStatus } : idea
        ),
      })),

      // Checklist per video
      addChecklistItem: (ideaId, text) => set((state) => ({
        ideas: state.ideas.map((idea) => {
          if (idea.id === ideaId) {
            const newItem = { id: `ch-${Date.now()}`, text, completed: false };
            return { ...idea, checklist: [...idea.checklist, newItem] };
          }
          return idea;
        }),
      })),

      toggleChecklistItem: (ideaId, itemId) => set((state) => ({
        ideas: state.ideas.map((idea) => {
          if (idea.id === ideaId) {
            return {
              ...idea,
              checklist: idea.checklist.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            };
          }
          return idea;
        }),
      })),

      deleteChecklistItem: (ideaId, itemId) => set((state) => ({
        ideas: state.ideas.map((idea) => {
          if (idea.id === ideaId) {
            return {
              ...idea,
              checklist: idea.checklist.filter((item) => item.id !== itemId),
            };
          }
          return idea;
        }),
      })),

      // Scripts
      updateScript: (ideaId, sectionUpdates) => set((state) => {
        const existingScript = state.scripts[ideaId] || {
          id: ideaId,
          ideaId: ideaId,
          sections: { hook: '', intro: '', mainPoints: '', cta: '', outro: '' },
          wordCount: 0,
          estimatedRuntime: 0,
          lastSaved: new Date().toISOString(),
          history: [],
        };

        const updatedSections = { ...existingScript.sections, ...sectionUpdates };
        
        // Calculate word count
        const textToCount = Object.values(updatedSections).join(' ');
        const wordCount = textToCount.trim() ? textToCount.trim().split(/\s+/).length : 0;
        
        // Duration in seconds = words / wpm * 60
        const estimatedRuntime = Math.round((wordCount / state.wpm) * 60);

        const updatedScript: Script = {
          ...existingScript,
          sections: updatedSections,
          wordCount,
          estimatedRuntime,
          lastSaved: new Date().toISOString(),
        };

        // Auto-change status of idea to 'scripting' if it was in 'idea' status
        const updatedIdeas = state.ideas.map((idea) => {
          if (idea.id === ideaId && idea.status === 'idea') {
            return { ...idea, status: 'scripting' as VideoStatus };
          }
          return idea;
        });

        return {
          scripts: { ...state.scripts, [ideaId]: updatedScript },
          ideas: updatedIdeas,
        };
      }),

      saveScriptVersion: (ideaId) => set((state) => {
        const script = state.scripts[ideaId];
        if (!script) return {};

        const newVersion = {
          id: `ver-${Date.now()}`,
          timestamp: new Date().toISOString(),
          sections: { ...script.sections },
          wordCount: script.wordCount,
        };

        const updatedScript = {
          ...script,
          history: [newVersion, ...script.history.slice(0, 9)], // keep last 10 versions
        };

        return {
          scripts: { ...state.scripts, [ideaId]: updatedScript },
        };
      }),

      restoreScriptVersion: (ideaId, versionId) => set((state) => {
        const script = state.scripts[ideaId];
        if (!script) return {};

        const version = script.history.find((v) => v.id === versionId);
        if (!version) return {};

        const updatedSections = { ...version.sections };
        const wordCount = version.wordCount;
        const estimatedRuntime = Math.round((wordCount / state.wpm) * 60);

        const restoredScript: Script = {
          ...script,
          sections: updatedSections,
          wordCount,
          estimatedRuntime,
          lastSaved: new Date().toISOString(),
        };

        return {
          scripts: { ...state.scripts, [ideaId]: restoredScript },
        };
      }),

      // Analytics
      addVideoPerformance: (perfData) => set((state) => {
        const newPerf: VideoPerformance = {
          ...perfData,
          id: `perf-${Date.now()}`,
        };
        
        // Sync idea status to published if idea is linked
        let updatedIdeas = state.ideas;
        if (perfData.ideaId) {
          updatedIdeas = state.ideas.map((idea) =>
            idea.id === perfData.ideaId ? { ...idea, status: 'published' as VideoStatus } : idea
          );
        }

        // Add to total performance and dynamically update current stats (simulating YouTube calculation)
        const updatedVideos = [newPerf, ...state.videosPerformance];
        const newTotalViews = state.currentStats.totalViews + perfData.views;
        const newWatchTime = state.currentStats.totalWatchTime + perfData.watchTime;
        const newRevenue = state.currentStats.totalRevenue + perfData.revenue;

        const newStats = {
          ...state.currentStats,
          totalViews: newTotalViews,
          totalWatchTime: newWatchTime,
          totalRevenue: Number(newRevenue.toFixed(2)),
          lastUpdated: new Date().toISOString(),
        };

        // Update goals that are linked to subscriber, views, watch time, or revenue metrics
        const updatedGoals = state.goals.map((goal) => {
          let currentVal = goal.currentValue;
          if (goal.category === 'views') currentVal = newTotalViews;
          if (goal.category === 'watch_time') currentVal = newWatchTime;
          if (goal.category === 'revenue') currentVal = newStats.totalRevenue;
          if (goal.category === 'uploads') currentVal = state.videosPerformance.filter(v => v.publishDate >= goal.deadline).length + 1; // plus this new upload

          return {
            ...goal,
            currentValue: currentVal,
            achieved: currentVal >= goal.targetValue,
          };
        });

        return {
          videosPerformance: updatedVideos,
          currentStats: newStats,
          ideas: updatedIdeas,
          goals: updatedGoals,
        };
      }),

      updateVideoPerformance: (id, updates) => set((state) => ({
        videosPerformance: state.videosPerformance.map((v) =>
          v.id === id ? { ...v, ...updates } : v
        ),
      })),

      deleteVideoPerformance: (id) => set((state) => ({
        videosPerformance: state.videosPerformance.filter((v) => v.id !== id),
      })),

      updateChannelStats: (statsUpdates) => set((state) => {
        const newStats = {
          ...state.currentStats,
          ...statsUpdates,
          lastUpdated: new Date().toISOString(),
        };

        // Also update sub goals if subs changed
        const updatedGoals = state.goals.map((goal) => {
          if (goal.category === 'subscribers' && statsUpdates.subscribers) {
            return {
              ...goal,
              currentValue: statsUpdates.subscribers,
              achieved: statsUpdates.subscribers >= goal.targetValue,
            };
          }
          return goal;
        });

        // Add to history record occasionally
        const todayStr = new Date().toISOString().substring(0, 7); // YYYY-MM
        const updatedHistory = state.statsHistory.map(h => 
          h.date === todayStr ? { ...h, subscribers: statsUpdates.subscribers || h.subscribers, views: statsUpdates.totalViews || h.views } : h
        );

        return {
          currentStats: newStats,
          goals: updatedGoals,
          statsHistory: updatedHistory,
        };
      }),

      // Goals
      addGoal: (goalData) => set((state) => {
        const newGoal: Goal = {
          ...goalData,
          id: `goal-${Date.now()}`,
          achieved: goalData.currentValue >= goalData.targetValue,
        };
        return { goals: [...state.goals, newGoal] };
      }),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((goal) => {
          if (goal.id === id) {
            const updated = { ...goal, ...updates };
            updated.achieved = updated.currentValue >= updated.targetValue;
            return updated;
          }
          return goal;
        }),
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      })),

      incrementStreak: () => set((state) => ({
        goals: state.goals.map((g) =>
          g.category === 'uploads' && g.streakDays !== undefined
            ? { ...g, streakDays: g.streakDays + 1 }
            : g
        ),
      })),

      resetStreak: () => set((state) => ({
        goals: state.goals.map((g) =>
          g.category === 'uploads' && g.streakDays !== undefined
            ? { ...g, streakDays: 0 }
            : g
        ),
      })),

      // Series / Pillars
      addSeries: (seriesData) => set((state) => {
        const newSeries: Series = {
          ...seriesData,
          id: `ser-${Date.now()}`,
        };
        return { series: [...state.series, newSeries] };
      }),

      deleteSeries: (id) => set((state) => ({
        series: state.series.filter((s) => s.id !== id),
        // reset seriesId on linked ideas
        ideas: state.ideas.map((idea) =>
          idea.seriesId === id ? { ...idea, seriesId: null } : idea
        ),
      })),

      // Backup & Recover
      importBackup: (backup) => {
        try {
          if (backup && typeof backup === 'object') {
            set({
              language: backup.language || 'en',
              theme: backup.theme || 'dark',
              wpm: backup.wpm || 150,
              ideas: backup.ideas || [],
              scripts: backup.scripts || {},
              series: backup.series || [],
              statsHistory: backup.statsHistory || [],
              currentStats: backup.currentStats || { subscribers: 0, totalViews: 0, totalWatchTime: 0, totalRevenue: 0, lastUpdated: '' },
              videosPerformance: backup.videosPerformance || [],
              goals: backup.goals || [],
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error(e);
          return false;
        }
      },

      resetStore: () => set({
        language: 'en',
        theme: 'dark',
        wpm: 150,
        ideas: initialIdeas,
        scripts: initialScripts,
        series: initialSeries,
        statsHistory: initialStatsHistory,
        currentStats: initialStats,
        videosPerformance: initialVideosPerformance,
        goals: initialGoals,
      }),
    }),
    {
      name: 'creo-storage', // unique name for localStorage
    }
  )
);
