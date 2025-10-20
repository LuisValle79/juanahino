'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Notification } from '@/types';
import { apiClient } from '@/lib/api';

interface AppState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number }
  | { type: 'MARK_ALL_READ' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: number };

const initialState: AppState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, leido: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, leido: true })),
        unreadCount: 0,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case 'REMOVE_NOTIFICATION':
      const notification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: notification && !notification.leido 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    loadNotifications: () => Promise<void>;
    loadUnreadCount: () => Promise<void>;
    markNotificationAsRead: (id: number) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
    deleteNotification: (id: number) => Promise<void>;
    refreshData: () => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    loadNotifications: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const notifications = await apiClient.getNotifications() as Notification[];
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Error loading notifications' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    loadUnreadCount: async () => {
      try {
        const count = await apiClient.getUnreadNotificationCount() as number;
        dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    },

    markNotificationAsRead: async (id: number) => {
      try {
        await apiClient.markNotificationAsRead(id);
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Error marking notification as read' 
        });
      }
    },

    markAllNotificationsAsRead: async () => {
      try {
        await apiClient.markAllNotificationsAsRead();
        dispatch({ type: 'MARK_ALL_READ' });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Error marking all notifications as read' 
        });
      }
    },

    deleteNotification: async (id: number) => {
      try {
        await apiClient.deleteNotification(id);
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Error deleting notification' 
        });
      }
    },

    refreshData: async () => {
      await Promise.all([
        actions.loadNotifications(),
        actions.loadUnreadCount(),
      ]);
    },
  };

  // Load initial data
  useEffect(() => {
    actions.refreshData().catch(error => {
      console.error('Error loading initial data:', error);
    });
  }, []);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      actions.loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
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