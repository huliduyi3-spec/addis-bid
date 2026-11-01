import React from 'react';
import { X, Bell, Trophy, AlertTriangle, Sparkles } from 'lucide-react';
import { AppNotification } from '../types/auction';

interface NotificationsPopoverProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mt-12 flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-sm text-white">Live Alerts</h3>
            <span className="text-[11px] font-mono text-slate-400">({notifications.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No notifications yet. Place bids to receive live status alerts!
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => onNotificationClick(n)}
                className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 hover:bg-slate-800/60 ${
                  !n.read ? 'bg-slate-950/40' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'win'
                    ? 'bg-amber-400/20 text-amber-400'
                    : n.type === 'duplicate_alert'
                    ? 'bg-rose-500/20 text-rose-400'
                    : n.type === 'unique_alert'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {n.type === 'win' ? (
                    <Trophy className="w-4 h-4" />
                  ) : n.type === 'duplicate_alert' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-white truncate">{n.title}</h4>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};