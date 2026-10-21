import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Receipt,
  PiggyBank,
  Calculator,
  Landmark,
  ShieldCheck,
  GraduationCap,
  BotMessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sprout,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
  const { profile, currentUser, logout } = useAuth();

  const navigationItems = [
    { label: t('sideDashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('sideProfile'), path: '/profile', icon: Building2 },
    { label: t('sideTransactions'), path: '/transactions', icon: Receipt },
    { label: t('sidePlanner'), path: '/financial-planner', icon: PiggyBank },
    { label: t('sideCalculator'), path: '/calculator', icon: Calculator },
    { label: t('sideSchemes'), path: '/schemes', icon: Landmark },
    { label: t('sideInsurance'), path: '/insurance', icon: ShieldCheck },
    { label: t('sideLearning'), path: '/learn', icon: GraduationCap },
    { label: t('sideChatbot'), path: '/chatbot', icon: BotMessageSquare },
    { label: t('sideReports'), path: '/reports', icon: BarChart3 },
    { label: t('sideSettings'), path: '/settings', icon: Settings },
    { label: t('sideHelp'), path: '/help', icon: HelpCircle },
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  const sidebarContent = (
    <aside
      className={`h-full bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Brand */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <button
            onClick={() => handleItemClick('/dashboard')}
            className={`flex items-center gap-2.5 text-left truncate cursor-pointer ${
              collapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sprout className="w-4 h-4 text-emerald-300" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-extrabold text-slate-900 tracking-tight text-base font-sans block">
                  Bachat<span className="text-emerald-700">Biz</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {profile?.businessName || 'Business Portal'}
                </span>
              </div>
            )}
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-500 hover:text-slate-700 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');

            return (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="p-3 border-t border-slate-100">
        {!collapsed ? (
          <div className="p-2 mb-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="truncate mr-2">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {profile?.displayName || currentUser?.fullName || 'Business Owner'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {profile?.district ? `${profile.district}, MH` : currentUser?.email}
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active Session"></span>
          </div>
        ) : null}

        <button
          onClick={logout}
          title={collapsed ? t('sideLogout') : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
          {!collapsed && <span>{t('sideLogout')}</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
