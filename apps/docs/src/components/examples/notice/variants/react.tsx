// apps/docs/src/components/examples/notice/variants/react.tsx
import { Notice } from '@cloudvoyant/helical-react';

export default function ReactNoticeVariants() {
  return (
    <div className="flex flex-col gap-2">
      <Notice variant="info" title="Heads up">
        An informative notice with a title and body.
      </Notice>
      <Notice variant="success" title="Deployed">
        The build succeeded.
      </Notice>
      <Notice variant="warning">No title — just a warning body.</Notice>
      <Notice variant="error" title="Build failed">
        Check the logs for details.
      </Notice>
    </div>
  );
}
