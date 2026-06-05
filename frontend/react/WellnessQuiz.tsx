import { Button } from './ui/Button';

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
  return (
    <section className="bg-primary py-20 text-white md:py-28">
      <div className="relative mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
        {settings.heading && (
          <h2 className="mb-6 font-bold uppercase leading-tight tracking-wide text-2xl text-white md:text-3xl">
            {settings.heading}
          </h2>
        )}
        {settings.subheading && (
          <p className="mb-10 text-base leading-relaxed text-white/90">{settings.subheading}</p>
        )}
        {settings.button_label && settings.button_link && (
          <Button href={settings.button_link} variant="inverse">
            {settings.button_label}
          </Button>
        )}
      </div>
    </section>
  );
}
