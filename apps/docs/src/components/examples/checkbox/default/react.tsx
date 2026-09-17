// apps/docs/src/components/examples/checkbox/default/react.tsx
import { Checkbox, CheckboxControl, CheckboxIndicator, CheckboxLabel } from '@cloudvoyant/helical-react';
import { Check } from 'lucide-react';

export default function ReactCheckboxDefault() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox defaultChecked>
        <CheckboxControl>
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </CheckboxControl>
        <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
      </Checkbox>
      <Checkbox>
        <CheckboxControl>
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </CheckboxControl>
        <CheckboxLabel>Subscribe to the newsletter</CheckboxLabel>
      </Checkbox>
    </div>
  );
}
