import { useState, useCallback, useRef, useEffect } from 'react';
import type { QuizDetail, QuizQuestion, HubQuiz, AnswerPayload } from '@/services/quizApi';
import {
  fetchHub,
  fetchQuiz,
  createAttempt,
  updateProgress,
  submitAttempt,
  generateIdempotencyKey,
} from '@/services/quizApi';
import { customerService } from '@/services/customer';

type Screen = 'hub' | 'question' | 'success' | 'loading' | 'error' | 'auth_prompt';

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuizModal({ open, onClose }: QuizModalProps) {
  const [screen, setScreen] = useState<Screen>('hub');
  const [hubQuizzes, setHubQuizzes] = useState<HubQuiz[]>([]);
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, AnswerPayload>>(new Map());
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const idempotencyKeyRef = useRef('');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load hub on open
  useEffect(() => {
    if (!open) return;
    setScreen('loading');
    fetchHub()
      .then((quizzes) => {
        setHubQuizzes(quizzes);
        setScreen('hub');
      })
      .catch(() => {
        setError('Unable to load quizzes');
        setScreen('error');
      });
  }, [open]);

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const resetState = useCallback(() => {
    setScreen('hub');
    setQuiz(null);
    setPendingQuizId(null);
    setCurrentIndex(0);
    setAnswers(new Map());
    setAttemptId(null);
    setError('');
    setSubmitting(false);
    idempotencyKeyRef.current = '';
  }, []);

  function handleClose() {
    resetState();
    onClose();
  }

  function handleSelectQuiz(quizId: string) {
    if (!customerService.isLoggedIn() && localStorage.getItem('asknatural_quiz_anon') !== 'true') {
      setPendingQuizId(quizId);
      setScreen('auth_prompt');
      return;
    }
    startQuiz(quizId);
  }

  async function startQuiz(quizId: string) {
    setScreen('loading');
    try {
      const [quizData, newAttemptId] = await Promise.all([
        fetchQuiz(quizId),
        createAttempt(quizId),
      ]);
      setQuiz(quizData);
      setAttemptId(newAttemptId);
      setCurrentIndex(0);
      setAnswers(new Map());
      idempotencyKeyRef.current = generateIdempotencyKey();
      setScreen('question');
    } catch {
      setError('Failed to start quiz');
      setScreen('error');
    }
  }

  function handleLoginRedirect() {
    window.location.href = customerService.getLoginUrl(window.location.pathname + window.location.search);
  }

  function handleContinueAnonymous() {
    localStorage.setItem('asknatural_quiz_anon', 'true');
    if (pendingQuizId) {
      startQuiz(pendingQuizId);
    } else {
      setScreen('hub');
    }
  }

  function getCurrentQuestion(): QuizQuestion | null {
    return quiz?.questions[currentIndex] || null;
  }

  function setAnswer(questionId: string, answer: AnswerPayload) {
    setAnswers((prev) => new Map(prev).set(questionId, answer));
  }

  function isCurrentAnswered(): boolean {
    const q = getCurrentQuestion();
    if (!q) return false;
    const answer = answers.get(q._id);
    if (!answer) return false;
    if (q.type === 'text') return !!answer.answerText?.trim();
    return !!answer.optionIds && answer.optionIds.length > 0;
  }

  function canProceed(): boolean {
    const q = getCurrentQuestion();
    if (!q) return false;
    if (!q.enforced) return true;
    return isCurrentAnswered();
  }

  function goNext() {
    if (!quiz || !attemptId) return;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= quiz.questions.length) {
      handleSubmit();
      return;
    }

    setCurrentIndex(nextIndex);
    updateProgress(attemptId, nextIndex);
  }

  function goPrev() {
    if (!attemptId) return;
    if (currentIndex === 0) {
      // Back to hub
      resetState();
      fetchHub().then(setHubQuizzes);
      setScreen('hub');
      return;
    }
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    updateProgress(attemptId, prevIndex);
  }

  async function handleSubmit() {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      const answerArray = Array.from(answers.values());
      await submitAttempt(attemptId, idempotencyKeyRef.current, answerArray);
      setScreen('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Your answers are safe, please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const q = getCurrentQuestion();
  const isLast = quiz ? currentIndex === quiz.questions.length - 1 : false;

  return (
    <div
      ref={overlayRef}
      className="quiz-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div className="quiz-modal">
        {/* Close button */}
        <button onClick={handleClose} className="quiz-close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Loading */}
        {screen === 'loading' && (
          <div className="quiz-screen quiz-loading">
            <div className="quiz-spinner" />
            <p>Loading...</p>
          </div>
        )}

        {/* Error */}
        {screen === 'error' && (
          <div className="quiz-screen quiz-error">
            <p>{error}</p>
            <button onClick={handleClose} className="quiz-btn quiz-btn-primary">
              Close
            </button>
          </div>
        )}

        {/* Hub */}
        {screen === 'hub' && (
          <div className="quiz-screen">
            <h2 className="quiz-title">Find What&rsquo;s Right For You</h2>
            <p className="quiz-subtitle">Choose a topic to get started</p>
            <div className="quiz-hub-list">
              {hubQuizzes.map((hq) => (
                <button
                  key={hq._id}
                  onClick={() => handleSelectQuiz(hq._id)}
                  className="quiz-hub-card"
                >
                  <span className="quiz-hub-card-text">{hq.homeOptionText}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auth Prompt */}
        {screen === 'auth_prompt' && (
          <div className="quiz-screen quiz-auth-prompt">
            <h2 className="quiz-title">Personalise Your Experience</h2>
            <p className="quiz-subtitle" style={{ maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.5 }}>
              You are not logged in now. Login to continue the quiz for a better personalised response or continue as anonymous.
            </p>
            <div className="quiz-auth-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto', width: '100%' }}>
              <button
                onClick={handleLoginRedirect}
                className="quiz-btn quiz-btn-primary"
                style={{ width: '100%', padding: '14px 20px', fontWeight: 600, fontSize: '1rem', borderRadius: '8px' }}
              >
                Login to Continue
              </button>
              <button
                onClick={handleContinueAnonymous}
                className="quiz-btn quiz-btn-secondary"
                style={{ width: '100%', padding: '14px 20px', fontWeight: 500, fontSize: '0.95rem', borderRadius: '8px', background: 'transparent', border: '1.5px solid var(--color-primary, #2A3B2C)', color: 'var(--color-primary, #2A3B2C)', cursor: 'pointer' }}
              >
                Continue as Anonymous
              </button>
            </div>
          </div>
        )}

        {/* Question */}
        {screen === 'question' && quiz && q && (
          <div className="quiz-screen quiz-question-screen">
            {/* Progress */}
            <div className="quiz-progress">
              <span className="quiz-progress-text">
                {currentIndex + 1} / {quiz.questions.length}
              </span>
              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question body */}
            <div className="quiz-question-body">
              <h3 className="quiz-question-text">{q.text}</h3>

              {/* Text input */}
              {q.type === 'text' && (
                <textarea
                  className="quiz-textarea"
                  rows={4}
                  placeholder="Type your answer..."
                  value={answers.get(q._id)?.answerText || ''}
                  onChange={(e) =>
                    setAnswer(q._id, { questionId: q._id, answerText: e.target.value })
                  }
                />
              )}

              {/* Single option (radio) */}
              {q.type === 'single_option' && (
                <div className="quiz-options">
                  {q.options.map((opt) => {
                    const selected = answers.get(q._id)?.optionIds?.[0] === opt._id;
                    return (
                      <button
                        key={opt._id}
                        className={`quiz-option ${selected ? 'quiz-option-selected' : ''}`}
                        onClick={() =>
                          setAnswer(q._id, { questionId: q._id, optionIds: [opt._id] })
                        }
                      >
                        <span className={`quiz-radio ${selected ? 'quiz-radio-checked' : ''}`} />
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Multi option (checkbox) */}
              {q.type === 'multi_option' && (
                <div className="quiz-options">
                  {q.options.map((opt) => {
                    const currentIds = answers.get(q._id)?.optionIds || [];
                    const selected = currentIds.includes(opt._id);
                    return (
                      <button
                        key={opt._id}
                        className={`quiz-option ${selected ? 'quiz-option-selected' : ''}`}
                        onClick={() => {
                          const newIds = selected
                            ? currentIds.filter((id) => id !== opt._id)
                            : [...currentIds, opt._id];
                          setAnswer(q._id, { questionId: q._id, optionIds: newIds });
                        }}
                      >
                        <span className={`quiz-checkbox ${selected ? 'quiz-checkbox-checked' : ''}`}>
                          {selected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="quiz-nav">
              <button onClick={goPrev} className="quiz-btn quiz-btn-secondary">
                {currentIndex === 0 ? 'Back' : 'Previous'}
              </button>
              <button
                onClick={goNext}
                disabled={!canProceed() || submitting}
                className="quiz-btn quiz-btn-primary"
              >
                {submitting ? 'Submitting...' : isLast ? 'Submit' : 'Next'}
              </button>
            </div>

            {error && <p className="quiz-error-msg">{error}</p>}
          </div>
        )}

        {/* Success */}
        {screen === 'success' && (
          <div className="quiz-screen quiz-success">
            <div className="quiz-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            {quiz?.outputUrl ? (
              <>
                <h2 className="quiz-title">Recycle is right for you.</h2>
                <p className="quiz-subtitle">
                  A nightly hot chocolate formulated for PCOS and hormonal support. We have tailored a routine specifically for your assessment.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                  <button
                    onClick={() => {
                      window.location.href = quiz.outputUrl!;
                    }}
                    className="quiz-btn quiz-btn-primary w-full"
                  >
                    Shop Now
                  </button>
                  <button
                    onClick={() => {
                      window.open('https://wa.me/918976034909?text=Hi,%20I%20just%20completed%20the%20assessment%20and%20would%20like%20to%20talk%20to%20an%20expert.', '_blank');
                    }}
                    className="quiz-btn quiz-btn-secondary w-full text-xs"
                  >
                    Talk to an expert first
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="quiz-title">Thank you for your response!</h2>
                <p className="quiz-subtitle">
                  Based on your responses, setting up a one-on-one consultation with our hormonal &amp; wellness experts is the best next step. Our experts will review your assessment and connect with you soon.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                  <button
                    onClick={() => {
                      window.open('https://wa.me/918976034909?text=Hi,%20I%20just%20completed%20the%20assessment%20and%20would%20like%20to%20set%20up%20a%20consultation%20call.', '_blank');
                    }}
                    className="quiz-btn quiz-btn-primary w-full"
                  >
                    Setup call / WhatsApp Expert
                  </button>
                  <button
                    onClick={handleClose}
                    className="quiz-btn quiz-btn-secondary w-full"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
