<!-- apps/docs/src/components/examples/manim/default/svelte.svelte -->
<script lang="ts">
  import { Manim } from '@cloudvoyant/helical-svelte';
</script>

<Manim
  width={640}
  height={360}
  build={async (manim, scene) => {
    const { Circle, Create, Square, Transform } = manim;
    const circle = new Circle({ radius: 1.5, color: '#f97316' });
    await scene.play(new Create(circle));
    await scene.wait(0.5);
    await scene.play(new Transform(circle, new Square({ sideLength: 2.5, color: '#38bdf8' })));
  }}
/>
