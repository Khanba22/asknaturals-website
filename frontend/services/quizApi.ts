const QUIZ_API_BASE = 'https://askknatural-dashboard.vercel.app/api/quiz';

// Fallback to direct API URL for local development
function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const meta = document.querySelector('meta[name="quiz-api-base"]');
    if (meta) return meta.getAttribute('content') || QUIZ_API_BASE;
  }
  return QUIZ_API_BASE;
}

function getSessionToken(): string {
  const KEY = 'asknatural_quiz_session';
  let token = localStorage.getItem(KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(KEY, token);
  }
  return token;
}

interface ShopifyCustomerProfile {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  orders_count?: number;
  total_spent?: number;
}

function getCustomerId(): string | null {
  const shopify = (window as unknown as { __SHOPIFY__?: { customer?: { id: string } } }).__SHOPIFY__;
  return shopify?.customer?.id?.toString() || null;
}

function getCustomerProfile(): ShopifyCustomerProfile | null {
  const shopify = (window as unknown as { __SHOPIFY__?: { customer?: ShopifyCustomerProfile } }).__SHOPIFY__;
  return shopify?.customer || null;
}

export interface HubQuiz {
  _id: string;
  homeOptionText: string;
  outputUrl?: string;
}

export interface QuizOption {
  _id: string;
  text: string;
  orderIndex: number;
}

export interface QuizQuestion {
  _id: string;
  text: string;
  type: 'text' | 'single_option' | 'multi_option';
  enforced: boolean;
  orderIndex: number;
  options: QuizOption[];
}

export interface QuizDetail {
  _id: string;
  name: string;
  homeOptionText?: string;
  outputUrl?: string;
  questions: QuizQuestion[];
}

export interface AnswerPayload {
  questionId: string;
  answerText?: string;
  optionIds?: string[];
}

export async function fetchHub(): Promise<HubQuiz[]> {
  const res = await fetch(`${getApiBase()}/hub`);
  if (!res.ok) throw new Error('Failed to load quizzes');
  return res.json();
}

export async function fetchQuiz(quizId: string): Promise<QuizDetail> {
  const res = await fetch(`${getApiBase()}/${quizId}`);
  if (!res.ok) throw new Error('Failed to load quiz');
  return res.json();
}

export async function createAttempt(quizId: string): Promise<string> {
  const res = await fetch(`${getApiBase()}/${quizId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionToken: getSessionToken(),
      shopifyCustomerId: getCustomerId(),
      sourceUrl: window.location.href,
      profile: getCustomerProfile(),
    }),
  });
  if (!res.ok) throw new Error('Failed to create attempt');
  const data = await res.json();
  return data.attemptId;
}

export function updateProgress(attemptId: string, currentQuestionIndex: number): void {
  // Fire-and-forget, don't await
  fetch(`${getApiBase()}/attempts/${attemptId}/progress`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentQuestionIndex }),
  }).catch(() => {
    // Silently ignore - this is fire-and-forget
  });
}

export async function submitAttempt(
  attemptId: string,
  idempotencyKey: string,
  answers: AnswerPayload[]
): Promise<void> {
  const res = await fetch(`${getApiBase()}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idempotencyKey,
      answers,
      profile: getCustomerProfile(),
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to submit');
  }
}

export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}
