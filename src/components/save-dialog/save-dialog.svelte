<script lang="ts">
  // Save dialog component for the Three Particles Editor
  import Button, { Label, Icon } from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import { getObjectDiff } from '../../js/three-particles-editor/save-and-load';
  import { getDefaultParticleSystemConfig } from '@newkrok/three-particles';
  import { showSuccessSnackbar } from '../../js/stores/snackbar-store';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism.css';
  import 'prismjs/components/prism-json';

  /**
   * Whether the save dialog is open
   */
  export let open = false;

  /**
   * Configuration content to display in the dialog
   */
  let configContent = '';

  /**
   * Opens the save dialog and prepares the configuration content
   */
  export const openSaveDialog = () => {
    const rawData = window.editor.getCurrentParticleSystemConfig();
    configContent = JSON.stringify(
      {
        ...getObjectDiff(getDefaultParticleSystemConfig(), rawData, {
          skippedProperties: ['map'],
        }),
        _editorData: { ...rawData._editorData },
      },
      null,
      2
    ); // Pretty print with 2 spaces indentation
    open = true;

    // Apply syntax highlighting after dialog opens
    setTimeout(() => {
      if (document.querySelector('#json-content')) {
        Prism.highlightElement(document.querySelector('#json-content'));
      }
    }, 50);
  };

  /**
   * Copies the current particle system configuration to clipboard
   */
  const copyToClipboard = () => {
    window.editor.copyToClipboard();
    showSuccessSnackbar('Particle system configuration copied to clipboard');
  };
</script>

<Dialog bind:open aria-labelledby="save-dialog-title" aria-describedby="save-dialog-content">
  <Title id="save-dialog-title">Save Configuration</Title>
  <Content id="save-dialog-content">
    <div class="save-dialog-content">
      <div class="code-container">
        <pre><code id="json-content" class="language-json">{configContent}</code></pre>
      </div>
    </div>
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>
      <Icon class="material-icons">close</Icon><Label>Close</Label>
    </Button>
    <Button on:click={copyToClipboard}>
      <Icon class="material-icons">file_copy</Icon><Label>Copy to Clipboard</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .save-dialog-content {
    width: 100%;
    min-width: 300px;
    max-width: 800px;
  }

  .code-container {
    max-height: 70vh;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 4px;
    background-color: #f5f5f5;
  }

  :global(.dark-theme) .code-container {
    background-color: #2d2d2d;
    color: #f8f8f2;
  }

  pre {
    margin: 0;
    padding: 16px;
    font-family: 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    tab-size: 2;
  }

  code {
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
