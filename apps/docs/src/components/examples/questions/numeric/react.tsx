// apps/docs/src/components/examples/questions/numeric/react.tsx
import { NumericQuestion } from '@cloudvoyant/helical-react';

export default function ReactQuestionNumeric() {
  return (
    <NumericQuestion
      id="numeric-demo"
      prompt="What is 2 + 2?"
      answer={4}
      tolerance={0.5}
      unit="units"
      explanation="Basic arithmetic."
    />
  );
}
