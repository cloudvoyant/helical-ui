// apps/docs/src/components/examples/switch/default/react.tsx
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from '@cloudvoyant/helical-react';

export default function ReactSwitchDefault() {
  return (
    <Switch defaultChecked>
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>Airplane mode</SwitchLabel>
    </Switch>
  );
}
