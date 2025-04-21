<script>
  import { createParticleSystemEditor } from './js/three-particles-editor';
  import Header from './components/header/header.svelte';
  import Content from './components/content/content.svelte';
  import LegacyConfigModal from './components/legacy-config-modal/legacy-config-modal.svelte';
  import Snackbar from './components/snackbar/snackbar.svelte';

  window.onload = () => createParticleSystemEditor('#three-particles-editor');
</script>

<Header />
<Content />
<LegacyConfigModal />
<Snackbar />
