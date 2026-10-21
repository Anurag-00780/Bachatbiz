import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useData } from '../../context/DataContext';
import { learningModules } from '../../data/learningData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Building2,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface LessonDetailViewProps {
  moduleId: string;
  onNavigate: (path: string) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  moduleId,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const { learningProgress, markModuleCompleted, recordQuizAttempt } = useData();

  const currentModuleIndex = learningModules.findIndex((m) => m.id === moduleId);
  const module = learningModules[currentModuleIndex] || learningModules[0];
  const nextModule = learningModules[currentModuleIndex + 1];

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);

  const existingAttempt = learningProgress.quizScores[module.id];

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    module.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    setQuizScore({ score, total: module.quiz.length });
    setQuizSubmitted(true);
    recordQuizAttempt(module.id, score, module.quiz.length);
    markModuleCompleted(module.id);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => onNavigate('/learn')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Academy</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Lesson {module.order} of {learningModules.length}
        </span>
      </div>

      {/* Lesson Header */}
      <div className="p-6 bg-emerald-900 text-white rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{module.estimatedMinutes} Minutes Reading Time</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {language === 'mr' ? module.titleMr : module.title}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          {language === 'mr' ? module.summaryMr : module.summary}
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {module.contentSections.map((section, idx) => (
          <Card key={idx} className="p-6 border-slate-200 space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'mr' ? section.headingMr : section.heading}
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {language === 'mr' ? section.bodyMr : section.body}
            </p>

            {section.tips && section.tips.length > 0 && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2 mt-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <Lightbulb className="w-4 h-4 text-emerald-700" />
                  <span>Practical Shopkeeper Takeaways:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-800 list-disc pl-5">
                  {(language === 'mr' ? section.tipsMr || section.tips : section.tips).map(
                    (tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </Card>
        ))}

        {/* Business Context Scenario */}
        <Card className="p-6 border-amber-200 bg-amber-50/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>
              Real Maharashtra Business Case:{' '}
              {language === 'mr'
                ? module.businessScenario.titleMr
                : module.businessScenario.title}
            </span>
          </div>

          <p className="text-xs text-amber-950/90 leading-relaxed">
            {language === 'mr'
              ? module.businessScenario.descriptionMr
              : module.businessScenario.description}
          </p>

          <div className="p-3 bg-white/90 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
            <strong>Key Lesson: </strong>
            {language === 'mr'
              ? module.businessScenario.takeawayMr
              : module.businessScenario.takeaway}
          </div>
        </Card>

        {/* Module Practice Quiz */}
        <Card className="p-6 border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-700" />
                <span>{t('learnQuiz')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Test your understanding to earn module completion credit
              </p>
            </div>

            {existingAttempt && !quizSubmitted && (
              <span className="text-xs font-mono text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Last Score: {existingAttempt.score} / {existingAttempt.total}
              </span>
            )}
          </div>

          <form onSubmit={handleQuizSubmit} className="space-y-6">
            {module.quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className="space-y-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    <span className="font-mono text-emerald-800 mr-1.5">
                      Q{qIdx + 1}.
                    </span>
                    {language === 'mr' ? q.questionMr : q.question}
                  </p>

                  <div className="space-y-2">
                    {(language === 'mr' ? q.optionsMr : q.options).map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let optionStyle =
                        'border-slate-200 bg-white hover:border-slate-300 text-slate-700';

                      if (quizSubmitted) {
                        if (optIdx === q.correctAnswerIndex) {
                          optionStyle =
                            'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold';
                        } else if (isOptionSelected && !isCorrect) {
                          optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                        }
                      } else if (isOptionSelected) {
                        optionStyle =
                          'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-medium ring-1 ring-emerald-600/20';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 text-[10px] ${
                              isOptionSelected
                                ? 'border-emerald-700 bg-emerald-700 text-white font-bold'
                                : 'border-slate-300'
                            }`}
                          >
                            {isOptionSelected ? '✓' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation shown after submission */}
                  {quizSubmitted && (
                    <div
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border border-rose-200 text-rose-900'
                      }`}
                    >
                      <p className="font-bold mb-0.5">
                        {isCorrect ? 'Correct! ✓' : 'Explanation:'}
                      </p>
                      <p>{language === 'mr' ? q.explanationMr : q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {!quizSubmitted ? (
              <Button
                type="submit"
                disabled={Object.keys(selectedAnswers).length < module.quiz.length}
                className="w-full font-semibold"
              >
                Submit Quiz Answers
              </Button>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Quiz Score: {quizScore?.score} / {quizScore?.total}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {quizScore && quizScore.score >= Math.ceil(quizScore.total * 0.6)
                      ? 'Congratulations! You successfully mastered this module.'
                      : 'Good effort! Review the explanations above and retake when ready.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Button size="sm" variant="outline" onClick={handleRetake}>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('learnRetakeQuiz')}</span>
                  </Button>

                  {nextModule && (
                    <Button
                      size="sm"
                      onClick={() => {
                        handleRetake();
                        onNavigate(`/learn/${nextModule.id}`);
                      }}
                    >
                      <span>Proceed to Next Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
