// apps/docs/src/components/examples/splitter/min-max/react.tsx
import {
  Splitter,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
} from '@cloudvoyant/helical-react';

export default function ReactSplitterMinMax() {
  return (
    <div className="h-64 w-full rounded-md border border-border bg-background">
      <Splitter
        defaultSize={[30, 70]}
        panels={[
          { id: 'a', minSize: 20, maxSize: 60 },
          { id: 'b', minSize: 40 },
        ]}
      >
        <SplitterPanel id="a" className="flex items-center justify-center">
          <span className="text-sm font-medium">A</span>
        </SplitterPanel>
        <SplitterResizeTrigger id="a:b">
          <SplitterResizeTriggerIndicator />
        </SplitterResizeTrigger>
        <SplitterPanel id="b" className="flex items-center justify-center">
          <span className="text-sm font-medium">B</span>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
