<script lang="ts">
  // Save dialog component for the Three Particles Editor
  import Button, { Label, Icon } from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import { getObjectDiff } from '../../js/three-particles-editor/save-and-load';
  import { getDefaultParticleSystemConfig } from '@newkrok/three-particles';
  import { generateDefaultName } from '../../js/utils/name-utils';
  import { showSuccessSnackbar, showErrorSnackbar } from '../../js/stores/snackbar-store';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism.css';
  import 'prismjs/components/prism-json';
  import { onMount } from 'svelte';
  import ConfigCard from '../config-card/config-card.svelte';

  /**
   * Whether the save dialog is open
   */
  export let open = false;

  /**
   * Configuration content to display in the dialog
   */
  let configContent = '';

  /**
   * Configuration name for saving to localStorage
   */
  let configName = '';

  /**
   * Raw configuration data
   */
  let rawConfigData: any = null;

  /**
   * Selected configuration for overwrite
   */
  let selectedConfig: SavedConfig | null = null;

  /**
   * Confirmation dialog state
   */
  let showConfirmDialog = false;

  /**
   * Confirmation dialog message
   */
  let confirmMessage = '';

  /**
   * Recently saved configurations
   */
  type SavedConfig = {
    id: string;
    name: string;
    config: any;
    createdAt: number;
    updatedAt: number;
    editorVersion?: string;
  };

  let recentConfigs: SavedConfig[] = [];

  /**
   * Load saved configurations from localStorage
   */
  const loadSavedConfigs = (): void => {
    try {
      const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
      const allConfigs: SavedConfig[] = savedConfigsStr ? JSON.parse(savedConfigsStr) : [];
      // Sort by updatedAt (newest first) and take the last 5
      recentConfigs = allConfigs.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
    } catch (error) {
      // Reset configs on error
      recentConfigs = [];
    }
  };

  /**
   * Save configuration to localStorage
   */
  const saveToLocalStorage = (): void => {
    let nameToUse = configName.trim();

    // If no name is provided, generate an "Untitled-X" name using the utility function
    if (!nameToUse) {
      nameToUse = generateDefaultName();
    }

    try {
      // Update metadata in the config
      window.editor.updateConfigMetadata(nameToUse);

      // Get updated metadata
      const metadata = window.editor.getConfigMetadata();

      const configId = `config-${metadata.createdAt}`;
      const newConfig: SavedConfig = {
        id: configId,
        name: nameToUse,
        config: rawConfigData,
        createdAt: metadata.createdAt,
        updatedAt: metadata.modifiedAt,
        editorVersion: metadata.editorVersion,
      };

      // Get existing configs or initialize empty array
      const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
      const savedConfigs: SavedConfig[] = savedConfigsStr ? JSON.parse(savedConfigsStr) : [];

      // Add new config
      savedConfigs.push(newConfig);

      // Save back to localStorage
      localStorage.setItem('three-particles-saved-configs', JSON.stringify(savedConfigs));

      // Refresh the list
      loadSavedConfigs();

      // Clear the input field
      configName = '';

      showSuccessSnackbar('Configuration saved successfully');
    } catch (error) {
      // Log error and show error message
      showErrorSnackbar('Failed to save configuration');
    }
  };

  /**
   * Show confirmation dialog for overwriting a configuration
   */
  const showOverwriteConfirmation = (config: SavedConfig): void => {
    selectedConfig = config;
    confirmMessage = `Do you want to overwrite the configuration "${config.name}"?`;
    showConfirmDialog = true;
  };

  /**
   * Overwrite an existing configuration
   */
  const overwriteConfig = (): void => {
    if (!selectedConfig) return;

    try {
      // Update metadata in the config, preserving the name
      window.editor.updateConfigMetadata(selectedConfig.name);

      // Get updated metadata
      const metadata = window.editor.getConfigMetadata();

      const updatedConfig: SavedConfig = {
        ...selectedConfig,
        config: rawConfigData,
        updatedAt: metadata.modifiedAt,
        editorVersion: metadata.editorVersion,
      };

      // Get existing configs
      const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
      let savedConfigs: SavedConfig[] = savedConfigsStr ? JSON.parse(savedConfigsStr) : [];

      // Replace the config with the updated one
      savedConfigs = savedConfigs.map((config) =>
        config.id === updatedConfig.id ? updatedConfig : config
      );

      // Save back to localStorage
      localStorage.setItem('three-particles-saved-configs', JSON.stringify(savedConfigs));

      // Refresh the list
      loadSavedConfigs();

      showSuccessSnackbar(`Configuration "${selectedConfig.name}" updated successfully`);
      showConfirmDialog = false;
      selectedConfig = null;
      open = false; // Close the main save dialog
    } catch (error) {
      // Show error message
      showErrorSnackbar('Failed to update configuration');
      showConfirmDialog = false;
      selectedConfig = null;
    }
  };

  /**
   * Delete a configuration from localStorage
   */
  const deleteConfig = (configId: string): void => {
    try {
      // Get existing configs
      const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
      const savedConfigs: SavedConfig[] = savedConfigsStr ? JSON.parse(savedConfigsStr) : [];

      // Filter out the config to delete
      const updatedConfigs = savedConfigs.filter((config) => config.id !== configId);

      // Save back to localStorage
      localStorage.setItem('three-particles-saved-configs', JSON.stringify(updatedConfigs));

      // Refresh the list
      loadSavedConfigs();

      showSuccessSnackbar('Configuration deleted successfully');
    } catch (error) {
      // Show error message
      showErrorSnackbar('Failed to delete configuration');
    }
  };

  /**
   * Opens the save dialog and prepares the configuration content
   */
  export const openSaveDialog = () => {
    rawConfigData = window.editor.getCurrentParticleSystemConfig();

    // Get metadata to pre-fill the config name
    const metadata = window.editor.getConfigMetadata();
    if (metadata && metadata.name) {
      configName = metadata.name;
    }

    configContent = JSON.stringify(
      {
        ...getObjectDiff(getDefaultParticleSystemConfig(), rawConfigData, {
          skippedProperties: ['map'],
        }),
        _editorData: { ...rawConfigData._editorData },
      },
      null,
      2
    ); // Pretty print with 2 spaces indentation

    // Load saved configs when dialog opens
    loadSavedConfigs();

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

  // Load saved configs on component mount
  onMount(() => {
    loadSavedConfigs();
  });
</script>

<Dialog bind:open aria-labelledby="save-dialog-title" aria-describedby="save-dialog-content">
  <!-- Confirmation Dialog -->
  {#if showConfirmDialog}
    <Dialog
      open={showConfirmDialog}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-content"
      scrimClickAction=""
      escapeKeyAction=""
    >
      <Title id="confirm-dialog-title">Confirm Overwrite</Title>
      <Content id="confirm-dialog-content">{confirmMessage}</Content>
      <Actions>
        <Button on:click={() => (showConfirmDialog = false)}>
          <Label>Cancel</Label>
        </Button>
        <Button on:click={overwriteConfig}>
          <Icon class="material-icons">save</Icon><Label>Overwrite</Label>
        </Button>
      </Actions>
    </Dialog>
  {/if}
  <Title id="save-dialog-title">Save Configuration</Title>
  <Content id="save-dialog-content">
    <div class="save-dialog-content">
      <div class="code-container">
        <pre><code id="json-content" class="language-json">{configContent}</code></pre>
      </div>

      <div class="save-form">
        <Textfield
          class="config-name-input"
          bind:value={configName}
          label="Configuration Name"
          required
        />
      </div>

      {#if recentConfigs.length > 0}
        <div class="separator"></div>

        <div class="recent-configs">
          <h3>Recently saved configs</h3>
          <div class="config-cards">
            {#each recentConfigs as config}
              <ConfigCard
                {config}
                onClick={() => showOverwriteConfirmation(config)}
                on:delete={({ detail }) => deleteConfig(detail.configId)}
              />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>
      <Icon class="material-icons">close</Icon><Label>Close</Label>
    </Button>
    <Button on:click={copyToClipboard}>
      <Icon class="material-icons">file_copy</Icon><Label>Copy to Clipboard</Label>
    </Button>
    <Button on:click={saveToLocalStorage}>
      <Icon class="material-icons">save</Icon><Label>Save to Local Storage</Label>
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
    max-height: 40vh;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 4px;
    background-color: #f5f5f5;
    margin-bottom: 16px;
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

  .save-form {
    margin: 16px 0;
  }

  .config-name-input {
    width: 100%;
  }

  .separator {
    height: 1px;
    background-color: var(--border, #ddd);
    margin: 24px 0;
    width: 100%;
  }

  :global(.dark-theme) .separator {
    background-color: #444;
  }

  .recent-configs {
    margin-top: 8px;
  }

  .recent-configs h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--primary);
  }

  .config-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    max-height: 25vh;
    overflow-y: auto;
    padding: 4px;
  }
</style>
