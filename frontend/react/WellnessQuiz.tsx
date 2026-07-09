import { useState } from 'react';
import { Button } from './ui/Button';
import { Reveal } from './motion/Reveal';
import { QuizModal } from './quiz/QuizModal';
import './quiz/quiz.css';

export interface WellnessQuizSettings {
  heading?: string;
  subheading?: string;
  button_label?: string;
  button_link?: string;
}

interface WellnessQuizProps {
  settings: WellnessQuizSettings;
}

export function WellnessQuiz({ settings }: WellnessQuizProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <QuizModal open={showModal} onClose={() => setShowModal(false)} />

      <section className="bg-primary py-20 text-white md:py-28">
        <Reveal className="relative mx-auto w-full max-w-2xl px-4 text-center sm:px-6" variant="scaleIn">
          {settings.heading && (
            <h2 className="mb-4 font-bold uppercase leading-tight tracking-wide text-3xl text-white md:text-4xl lg:text-5xl">
              {settings.heading}
            </h2>
          )}
          {settings.subheading && (
            <p className="mb-10 text-lg font-semibold leading-relaxed text-white/90 md:text-xl">
              {settings.subheading}
            </p>
          )}
          {settings.button_label && (
            <Button
              variant="inverse"
              className="!px-12 !py-4 !text-base font-bold uppercase tracking-wider"
              onClick={() => setShowModal(true)}
            >
              {settings.button_label}
            </Button>
          )}
        </Reveal>
      </section>
    </>
  );
}
