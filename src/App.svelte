<script>
  import { createParticleSystemEditor } from "./js/three-particles-editor.js";
  import Header from "./components/header/header.svelte";
  import Content from "./components/content/content.svelte";

  (window.onload = () => createParticleSystemEditor("#three-particles-editor")),
    0;
</script>

<Header />
<Content />
