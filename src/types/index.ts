export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'Easy' | 'Moderate' | 'Complex';
  interest: 1 | 2 | 3 | 4 | 5;
  field: string;
  status: 'Exploring' | 'Reading' | 'Drafting' | 'Writing' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
  isAIGenerated: boolean;
  notes?: string;
}

export interface AITopicRequest {
  field: string;
  interestArea?: string;
}

export interface AITopicSuggestion {
  title: string;
  description: string;
  field: string;
}

export interface FilterState {
  field: string;
  difficulty: string;
  status: string;
  interest: number;
  tags: string[];
}

export type TabType = 'ai-suggestions' | 'my-ideas' | 'progress-tracker' | 'settings';