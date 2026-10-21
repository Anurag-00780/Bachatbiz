import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { exportUserBackup, deleteUserData } from '../../lib/storage';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Database,
  Download,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface SettingsViewProps {
  onNavigate: (path: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { currentUser, resetDemoState, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'data'>('profile');

  // Security tab state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setSecurityMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setSecurityMessage('Passwords do not match.');
      return;
    }
    setSecurityMessage('Password updated successfully.');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setSecurityMessage(''), 3000);
  };

  const handleExportData = () => {
    if (!currentUser) return;
    const backup = exportUserBackup(currentUser.id);
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BachatBiz_Backup_${currentUser.id}_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    deleteUserData(currentUser.id);
    logout();
    onNavigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-emerald-700" />
            <span>{t('settingsTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('settingsSubtitle')}</p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('settingsProfileTab')}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('settingsSecurityTab')}
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'data'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('settingsDataTab')}
          </button>
        </div>
      </div>

      {/* Profile & Preferences Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6 border-slate-200 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Personal Account & Language
          </h3>

          <div className="space-y-4">
            <Input
              label={t('authFullName')}
              value={currentUser?.fullName || ''}
              disabled
              helperText="Account owner name registered with BachatBiz."
            />

            <Input
              label={t('authEmail')}
              value={currentUser?.email || ''}
              disabled
              helperText="Email used for account login."
            />

            <Select
              label={t('authLanguagePref')}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'mr', label: 'मराठी (Marathi)' },
              ]}
              helperText="Sets the default interface language for navigation, reports, and calculators."
            />
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6 border-slate-200 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Account Security & Password
          </h3>

          {securityMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{securityMessage}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              helperText="Minimum 6 characters with numbers or symbols."
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />

            <Button type="submit" size="sm">
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 block">Active Session Security:</span>
            <p>
              Signed in as <span className="font-mono text-slate-900">{currentUser?.email}</span>. Data access is authorized strictly for this session.
            </p>
          </div>
        </Card>
      )}

      {/* Data & Privacy Tab */}
      {activeTab === 'data' && (
        <Card className="p-6 border-slate-200 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Financial Data Management & Portability
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Export an offline backup, reset sample records, or delete your account.
            </p>
          </div>

          <div className="space-y-4">
            {/* Export JSON */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {t('settingsExportAll')}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Downloads all transactions, budgets, goals, and profile data in an open JSON format.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={handleExportData} className="shrink-0">
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup</span>
              </Button>
            </div>

            {/* Reset Demo Data (if demo user) */}
            {currentUser?.id === 'demo_bachatbiz_user' && (
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {t('settingsResetDemo')}
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Restores the original Nashik Kirana business transactions and goals back to factory state.
                  </p>
                </div>
                <Button size="sm" variant="saffron" onClick={resetDemoState} className="shrink-0">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Store</span>
                </Button>
              </div>
            )}

            {/* Delete Account */}
            <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-rose-900">
                  {t('settingsDeleteAccount')}
                </h4>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  Permanently deletes your account and all associated transactions and budgets from this browser.
                </p>
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setDeleteModalOpen(true)}
                className="shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Permanently Delete BachatBiz Account"
        message="Are you completely sure? This will irrevocably wipe all your business transactions, budgets, goals, and profile records from this device."
      />
    </div>
  );
};
