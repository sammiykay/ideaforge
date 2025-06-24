import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Idea, FilterState, TabType } from '../types';

interface AppState {
  ideas: Idea[];
  activeTab: TabType;
  filters: FilterState;
  aiSuggestions: Idea[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_ACTIVE_TAB'; payload: TabType }
  | { type: 'ADD_IDEA'; payload: Idea }
  | { type: 'UPDATE_IDEA'; payload: Idea }
  | { type: 'DELETE_IDEA'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_AI_SUGGESTIONS'; payload: Idea[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: Idea[] };

const initialState: AppState = {
  ideas: [],
  activeTab: 'ai-suggestions',
  filters: {
    field: '',
    difficulty: '',
    status: '',
    interest: 0,
    tags: [],
  },
  aiSuggestions: [],
  isLoading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADD_IDEA':
      return { ...state, ideas: [...state.ideas, action.payload] };
    case 'UPDATE_IDEA':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea.id === action.payload.id ? action.payload : idea
        ),
      };
    case 'DELETE_IDEA':
      return {
        ...state,
        ideas: state.ideas.filter(idea => idea.id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_AI_SUGGESTIONS':
      return { ...state, aiSuggestions: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOAD_DATA':
      return { ...state, ideas: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideaforge-ideas');
    if (savedIdeas) {
      try {
        const ideas = JSON.parse(savedIdeas).map((idea: any) => ({
          ...idea,
          createdAt: new Date(idea.createdAt),
          updatedAt: new Date(idea.updatedAt),
        }));
        dispatch({ type: 'LOAD_DATA', payload: ideas });
      } catch (error) {
        console.error('Error loading ideas from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever ideas change
  useEffect(() => {
    localStorage.setItem('ideaforge-ideas', JSON.stringify(state.ideas));
  }, [state.ideas]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}