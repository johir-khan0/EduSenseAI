

import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../types';
import { View } from '../App';
import { LogOutIcon, MenuIcon, PlayCircleIcon, UserIcon, LightbulbIcon, BookOpenIcon, BellIcon, ArrowLeftIcon } from './icons';
import Button from './Button';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
  activeView: View;
  onOpenJoinClassModal: () => void;
  onOpenAssessmentModal: () => void;
  onNavigateToSmartClassInsight?: () => void;
  onNavigateToMyClassrooms?: () => void;
  onNavigateToUserProfile: () => void;
  notifications: Notification[];
  onMarkNotificationsRead: (id?: string) => void;
  onBack: () => void;
  hasHistory: boolean;
}

const formatTimeAgo = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar, activeView, onOpenJoinClassModal, onOpenAssessmentModal, onNavigateToSmartClassInsight, onNavigateToMyClassrooms, onNavigateToUserProfile, notifications, onMarkNotificationsRead, onBack, hasHistory }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [animateXp, setAnimateXp] = useState(false);
  const prevXp = useRef(user.xp);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user.xp !== undefined && prevXp.current !== undefined && user.xp > prevXp.current) {
      setAnimateXp(true);
      const timer = setTimeout(() => setAnimateXp(false), 1000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [user.xp]);

  useEffect(() => {
    prevXp.current = user.xp;
  }, [user.xp]);

  return (
    <header className="sticky top-0 z-20 bg-surface/70 backdrop-blur-xl border-b border-black/5">
       <style>{`
          @keyframes xp-gain {
            0% { transform: scale(1); background-color: transparent; }
            50% { transform: scale(1.1); background-color: #FBBF24; color: white; }
            100% { transform: scale(1); background-color: transparent; }
          }
          .animate-xp-gain {
            animation: xp-gain 1s ease-out;
          }
        `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary hover:bg-neutral-light/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            {hasHistory && (
                <button
                    onClick={onBack}
                    className="ml-2 flex items-center p-2 rounded-md text-neutral-dark hover:text-primary hover:bg-neutral-light/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    aria-label="Go back"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                    <span className="hidden sm:inline ml-1 font-semibold">Back</span>
                </button>
            )}
          </div>
          
          <div className="flex-1 flex justify-end items-center">
            {user.role === 'student' && (
              <div className="flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4">
                <div 
                    className={`font-bold text-yellow-600 bg-yellow-400/20 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${animateXp ? 'animate-xp-gain' : ''}`}
                >
                    💰 {user.xp ?? 0} XP
                </div>
                 {onNavigateToMyClassrooms && (
                    <Button variant="outline" onClick={onNavigateToMyClassrooms} className="!py-2 !px-3 hidden sm:inline-flex">
                        <BookOpenIcon className="h-4 w-4 mr-2" />
                        My Classroom
                    </Button>
                )}
                <Button variant="secondary" onClick={onOpenJoinClassModal} className="!py-2 !px-3 hidden sm:inline-flex">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Join Class
                </Button>
                <Button onClick={onOpenAssessmentModal} className="!py-2 !px-3 hidden sm:inline-flex">
                  <PlayCircleIcon className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            )}
            
            {user.role === 'teacher' && onNavigateToSmartClassInsight && (
              <div className="flex items-center gap-4 mr-4">
                <Button variant="secondary" onClick={onNavigateToSmartClassInsight} className="!py-2 !px-4 hidden sm:inline-flex">
                  <LightbulbIcon className="h-4 w-4 mr-2" />
                  Smart Class Insight
                </Button>
              </div>
            )}

            <div className="relative">
                <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 rounded-full text-neutral-dark hover:bg-neutral-light/40 transition-colors relative"
                    aria-label={`${unreadCount} unread notifications`}
                >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {isNotificationOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-surface/80 backdrop-blur-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                        <div className="p-4 flex justify-between items-center border-b border-black/10">
                            <h3 className="font-bold text-neutral-extradark">Notifications</h3>
                            {unreadCount > 0 && <button onClick={() => onMarkNotificationsRead()} className="text-xs font-semibold text-primary hover:underline">Mark all as read</button>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-black/5 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                                    <p className="text-sm text-neutral-dark">{n.text}</p>
                                    <p className="text-xs text-neutral-medium mt-1">{formatTimeAgo(n.timestamp)}</p>
                                </div>
                            )) : <p className="p-4 text-center text-sm text-neutral-medium">No new notifications.</p>}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative ml-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-light/40 transition-colors"
              >
                <img className="h-8 w-8 rounded-full" src={user.avatar} alt="User avatar" />
                <span className="hidden sm:inline text-sm font-semibold text-neutral-dark pr-2">{user.name}</span>
              </button>
              {isDropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-surface/80 backdrop-blur-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1" role="none">
                     {user.role === 'student' && (
                        <div className="sm:hidden border-b border-black/10 mb-1 pb-1">
                             <button
                                onClick={() => { onNavigateToMyClassrooms?.(); setIsDropdownOpen(false); }}
                                className="w-full flex items-center px-4 py-2 text-sm text-left text-neutral-dark hover:bg-primary/10 hover:text-primary-dark"
                                role="menuitem"
                            >
                                <BookOpenIcon className="h-5 w-5 mr-3" />
                                My Classrooms
                            </button>
                             <button
                                onClick={() => { onOpenJoinClassModal(); setIsDropdownOpen(false); }}
                                className="w-full flex items-center px-4 py-2 text-sm text-left text-neutral-dark hover:bg-secondary/10 hover:text-secondary-dark"
                                role="menuitem"
                            >
                                <UserIcon className="h-5 w-5 mr-3" />
                                Join a Classroom
                            </button>
                             <button
                                onClick={() => { onOpenAssessmentModal(); setIsDropdownOpen(false); }}
                                className="w-full flex items-center px-4 py-2 text-sm text-left text-neutral-dark hover:bg-primary/10 hover:text-primary-dark"
                                role="menuitem"
                            >
                                <PlayCircleIcon className="h-5 w-5 mr-3" />
                                Start Assessment
                            </button>
                        </div>
                    )}
                    {user.role === 'teacher' && onNavigateToSmartClassInsight && (
                        <div className="sm:hidden border-b border-black/10 mb-1 pb-1">
                            <button
                                onClick={() => { onNavigateToSmartClassInsight(); setIsDropdownOpen(false); }}
                                className="w-full flex items-center px-4 py-2 text-sm text-left text-neutral-dark hover:bg-secondary/10 hover:text-secondary-dark"
                                role="menuitem"
                            >
                                <LightbulbIcon className="h-5 w-5 mr-3" />
                                Smart Class Insight
                            </button>
                        </div>
                     )}
                     <button
                        onClick={() => { onNavigateToUserProfile(); setIsDropdownOpen(false); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-left text-neutral-dark hover:bg-primary/10 hover:text-primary-dark"
                        role="menuitem"
                    >
                        <UserIcon className="h-5 w-5 mr-3" />
                        My Profile
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-left text-neutral-dark hover:bg-danger/10 hover:text-danger-dark"
                      role="menuitem"
                    >
                      <LogOutIcon className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
