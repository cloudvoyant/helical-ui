// apps/docs/src/components/examples/splitter/vertical/react.tsx
import {
  Splitter,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
} from '@cloudvoyant/helical-react';

export default function ReactSplitterVertical() {
  return (
    <div className="h-64 w-full rounded-md border border-border bg-background">
      <Splitter orientation="vertical" panels={[{ id: 'a' }, { id: 'b' }]}>
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
