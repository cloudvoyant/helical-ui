// apps/docs/src/components/examples/quiz/default/react.tsx
import { Quiz } from '@cloudvoyant/helical-react';

const questions = [
  {
    id: 'a1',
    type: 'single' as const,
    prompt: 'Which runs JS outside the browser?',
    choices: ['Python', 'Node.js', 'Go'],
    correct: 1,
  },
  {
    id: 'a2',
    type: 'numeric' as const,
    prompt: 'What is 3 × 3?',
    answer: 9,
  },
];

export default function ReactQuizDefault() {
  return <Quiz id="quiz-demo" title="Quick check" questions={questions} />;
}
