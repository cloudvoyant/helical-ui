// apps/docs/src/components/examples/splitter/disabled/react.tsx
import {
  Splitter,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
} from '@cloudvoyant/helical-react';

export default function ReactSplitterDisabled() {
  return (
    <div className="h-64 w-full rounded-md border border-border bg-background">
      <Splitter panels={[{ id: 'a' }, { id: 'b' }]}>
        <SplitterPanel id="a" className="flex items-center justify-center">
          <span className="text-sm font-medium">A</span>
        </SplitterPanel>
        <SplitterResizeTrigger id="a:b" disabled>
          <SplitterResizeTriggerIndicator />
        </SplitterResizeTrigger>
        <SplitterPanel id="b" className="flex items-center justify-center">
          <span className="text-sm font-medium">B</span>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
