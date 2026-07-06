export type Priority = 'hot' | 'warm' | 'cold';

export type VideoStatus =
  | 'idea'
  | 'scripting'
  | 'ready_to_film'
  | 'filmed'
  | 'editing'
  | 'published'
  | 'archived';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ABNote {
  id: string;
  title: string;
  thumbnailUrl?: string;
  notes: string;
  score?: number; // scale of 1-10 or feedback notes
}

export interface Idea {
  id: string;
  title: string;
  hook: string;
  priority: Priority;
  status: VideoStatus;
  tags: string[];
  notes: string;
  links: string[];
  thumbnailUrl: string | null;
  seriesId: string | null;
  scheduledDate: string | null; // YYYY-MM-DD
  checklist: ChecklistItem[];
  abNotes: ABNote[];
  keywords: string[];
  descriptionTemplate: string;
}

export interface ScriptSection {
  hook: string;
  intro: string;
  mainPoints: string;
  cta: string;
  outro: string;
}

export interface ScriptVersion {
  id: string;
  timestamp: string;
  sections: ScriptSection;
  wordCount: number;
}

export interface Script {
  id: string; // matches Idea ID
  ideaId: string;
  sections: ScriptSection;
  wordCount: number;
  estimatedRuntime: number; // in seconds
  lastSaved: string;
  history: ScriptVersion[];
}

export interface Series {
  id: string;
  name: string;
  description: string;
  color: string; // hex or tailwind color name
}

export interface ChannelStats {
  subscribers: number;
  totalViews: number;
  totalWatchTime: number; // in hours
  totalRevenue: number;
  lastUpdated: string;
}

export interface VideoPerformance {
  id: string;
  ideaId: string | null;
  title: string;
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  watchTime: number; // hours
  revenue: number;
  targetViews: number;
}

export interface Goal {
  id: string;
  title: string;
  category: 'subscribers' | 'views' | 'uploads' | 'revenue' | 'watch_time';
  targetValue: number;
  currentValue: number;
  deadline: string;
  achieved: boolean;
  streakDays?: number;
}

export interface AppState {
  language: 'en' | 'fa';
  theme: 'light' | 'dark';
  wpm: number; // Words Per Minute for reading pace (default 150)
  ideas: Idea[];
  scripts: { [ideaId: string]: Script };
  series: Series[];
  statsHistory: { date: string; subscribers: number; views: number; uploads: number }[];
  currentStats: ChannelStats;
  videosPerformance: VideoPerformance[];
  goals: Goal[];
}
