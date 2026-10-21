import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useData } from '../../context/DataContext';
import { learningModules } from '../../data/learningData';
import { LearningModule } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Award,
} from 'lucide-react';

interface LearningViewProps {
  onNavigate: (path: string) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { learningProgress } = useData();

  const completedCount = learningProgress.completedModuleIds.length;
  const totalCount = learningModules.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner with Academy Progress */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-emerald-300" />
            <span>Interactive Business Literacy Academy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('learnTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
            {t('learnSubtitle')}
          </p>
        </div>

        {/* Progress Card */}
        <div className="w-full md:w-64 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2 shrink-0">
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-200 font-medium">Academy Progress</span>
            <span className="font-mono tabular-nums font-bold text-white">
              {completedCount} / {totalCount} Done
            </span>
          </div>
          <div className="h-2 w-full bg-emerald-950/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-emerald-300">
            <span>{progressPercent}% Complete</span>
            {progressPercent === 100 && (
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Certified!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningModules.map((module) => {
          const isCompleted = learningProgress.completedModuleIds.includes(module.id);
          const quizRecord = learningProgress.quizScores[module.id];

          return (
            <Card
              key={module.id}
              className={`p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-sm cursor-pointer border ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-emerald-600/60'
              }`}
              onClick={() => onNavigate(`/learn/${module.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-800 font-bold">
                    Lesson {String(module.order).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{module.estimatedMinutes} mins</span>
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px] bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {language === 'mr' ? module.titleMr : module.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'mr' ? module.summaryMr : module.summary}
                </p>

                {quizRecord && (
                  <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Quiz Result:</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-800">
                      Score: {quizRecord.score} / {quizRecord.total} ({quizRecord.passed ? 'Passed ✓' : 'Needs Review'})
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {module.quiz.length} practice questions
                </span>
                <Button
                  size="sm"
                  variant={isCompleted ? 'outline' : 'primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(`/learn/${module.id}`);
                  }}
                >
                  <span>{isCompleted ? t('learnContinue') : t('learnStart')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
