// apps/docs/src/components/examples/splitter/multiple-panels/react.tsx
import {
  Splitter,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
} from '@cloudvoyant/helical-react';

export default function ReactSplitterMultiplePanels() {
  return (
    <div className="h-64 w-full rounded-md border border-border bg-background">
      <Splitter panels={[{ id: 'a' }, { id: 'b' }, { id: 'c' }]}>
        <SplitterPanel id="a" className="flex items-center justify-center">
          <span className="text-sm font-medium">A</span>
        </SplitterPanel>
        <SplitterResizeTrigger id="a:b">
          <SplitterResizeTriggerIndicator />
        </SplitterResizeTrigger>
        <SplitterPanel id="b" className="flex items-center justify-center">
          <span className="text-sm font-medium">B</span>
        </SplitterPanel>
        <SplitterResizeTrigger id="b:c">
          <SplitterResizeTriggerIndicator />
        </SplitterResizeTrigger>
        <SplitterPanel id="c" className="flex items-center justify-center">
          <span className="text-sm font-medium">C</span>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
