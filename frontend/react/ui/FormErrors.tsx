import type { CustomerFormError } from '@/types/shopify';

interface FormErrorsProps {
  errors?: CustomerFormError[];
}

export function FormErrors({ errors }: FormErrorsProps) {
  if (!errors?.length) return null;

  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      <p className="font-medium">Please fix the following:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((error) => (
          <li key={`${error.field}-${error.message}`}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
}
