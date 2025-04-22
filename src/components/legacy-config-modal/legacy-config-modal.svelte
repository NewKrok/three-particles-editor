<script lang="ts">
  import Dialog from '@smui/dialog';
  import {
    Title as DialogTitle,
    Content as DialogContent,
    Actions as DialogActions,
  } from '@smui/dialog';
  import Button from '@smui/button';
  import { showLegacyConfigModal } from '../../js/three-particles-editor/showLegacyConfigModal';

  const closeModal = () => {
    showLegacyConfigModal.set(false);
  };

  let open = false;
  $: open = $showLegacyConfigModal;
</script>

<Dialog bind:open fullscreen={false} surface$style="min-width: 400px;">
  <div class="header">
    <span class="material-icons warning-icon">warning</span>
    <DialogTitle class="title">Legacy Configuration Detected</DialogTitle>
  </div>

  <DialogContent>
    <div class="content-container">
      <p class="message">
        The loaded configuration appears to be from an <strong>older version</strong>.
      </p>
      <p class="message">It will be automatically converted to the new 2.0.0+ format.</p>
    </div>
  </DialogContent>

  <DialogActions>
    <Button variant="raised" color="primary" on:click={closeModal}>OK</Button>
  </DialogActions>
</Dialog>

<style>
  .header {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #ffa726;
    color: white;
  }

  .warning-icon {
    margin-right: 8px;
    font-size: 24px;
    display: flex;
    align-items: center;
  }

  :global(.title) {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
  }

  :global(.title h2) {
    margin: 0;
    padding: 0;
    font-size: 18px;
    line-height: 24px;
  }

  .content-container {
    padding: 8px 0;
  }

  .message {
    margin: 8px 0;
    font-size: 16px;
    line-height: 1.5;
  }

  .message strong {
    color: #f57c00;
  }
</style>
