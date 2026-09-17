// apps/docs/src/components/examples/questions/multiple/react.tsx
import { MultipleChoiceQuestion } from '@cloudvoyant/helical-react';

export default function ReactQuestionMultiple() {
  return (
    <MultipleChoiceQuestion
      id="multiple-demo"
      prompt="Select the primitives."
      choices={['string', 'number', 'widget', 'boolean']}
      correct={[0, 1, 3]}
      explanation="Widget is not a primitive."
    />
  );
}
