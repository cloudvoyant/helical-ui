// apps/docs/src/components/examples/questions/single/react.tsx
import { SingleChoiceQuestion } from '@cloudvoyant/helical-react';

export default function ReactQuestionSingle() {
  return (
    <SingleChoiceQuestion
      id="single-demo"
      prompt="Which of these is a JavaScript runtime?"
      choices={['Python', 'Node.js', 'Ruby', 'Go']}
      correct={1}
      explanation="Node.js runs JavaScript outside the browser."
    />
  );
}
