// apps/docs/src/components/examples/button/with-icon/react.tsx
import { Button } from '@cloudvoyant/helical-react';
import { Check, Trash2, AlertTriangle, Info, Plus, Download } from 'lucide-react';

export default function ReactButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button color="success">
        <Check className="size-4" />
        Approve
      </Button>
      <Button color="danger">
        <Trash2 className="size-4" />
        Delete
      </Button>
      <Button color="warn">
        <AlertTriangle className="size-4" />
        Warn
      </Button>
      <Button color="info">
        <Info className="size-4" />
        Info
      </Button>
      <Button>
        <Plus className="size-4" />
        Add
      </Button>
      <Button color="secondary">
        <Download className="size-4" />
        Export
      </Button>
    </div>
  );
}
