// apps/docs/src/components/examples/dialog/multiple-triggers/react.tsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-react';

const sections = [
  { id: 'general', title: 'General', body: 'General account settings.' },
  { id: 'privacy', title: 'Privacy', body: 'Privacy and data settings.' },
  { id: 'billing', title: 'Billing', body: 'Billing and payment settings.' },
];

export default function ReactDialogMultipleTriggers() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(sections[0]);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => {
              setActive(section);
              setOpen(true);
            }}
            className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
          >
            {section.title}
          </button>
        ))}
      </div>
      <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent>
          <DialogTitle>{active.title}</DialogTitle>
          <DialogDescription>{active.body}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
