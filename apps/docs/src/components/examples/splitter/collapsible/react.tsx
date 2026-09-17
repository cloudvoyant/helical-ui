// apps/docs/src/components/examples/splitter/collapsible/react.tsx
import {
  Splitter,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
} from '@cloudvoyant/helical-react';

export default function ReactSplitterCollapsible() {
  return (
    <div className="h-64 w-full rounded-md border border-border bg-background">
      <Splitter
        defaultSize={[40, 60]}
        panels={[
          { id: 'a', collapsible: true, collapsedSize: 5, minSize: 25 },
          { id: 'b', minSize: 50 },
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
