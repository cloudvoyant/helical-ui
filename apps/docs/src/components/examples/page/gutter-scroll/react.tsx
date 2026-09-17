// apps/docs/src/components/examples/page/gutter-scroll/react.tsx
import { Page, PageGutter, PageContent, Scroll } from '@cloudvoyant/helical-react';

const tags = Array.from({ length: 60 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

export default function ReactPageGutterScroll() {
  return (
    <Page>
      <PageGutter side="left">
        <Scroll variant="hidden" className="w-full border-r border-border bg-muted/40">
          <div>
            <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">Releases</p>
            {tags.map((tag) => (
              <div key={tag} className="border-t border-border px-2 py-1.5 text-sm text-muted-foreground">
                {tag}
              </div>
            ))}
          </div>
        </Scroll>
      </PageGutter>
      <PageContent className="flex items-center justify-center">
        <div className="p-8 text-center">
          <h1 className="text-xl font-semibold">Scrolling gutters</h1>
          <p className="mt-2 text-sm text-muted-foreground">The gutter content scrolls independently via Scroll.</p>
        </div>
      </PageContent>
    </Page>
  );
}
