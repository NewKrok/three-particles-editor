<script lang="ts">
  // Save dialog component for the Three Particles Editor
  import Button, { Label, Icon } from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import { getObjectDiff } from '../../js/three-particles-editor/save-and-load';
  import { getDefaultParticleSystemConfig } from '@newkrok/three-particles';
  import { showSuccessSnackbar, showErrorSnackbar } from '../../js/stores/snackbar-store';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism.css';
  import 'prismjs/components/prism-json';
  import { onMount } from 'svelte';

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
  };

  let recentConfigs: SavedConfig[] = [];

  /**
   * Format date for display
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

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

    // If no name is provided, generate an "Untitled-X" name
    if (!nameToUse) {
      // Get existing configs to find the next available number
      const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
      const savedConfigs: SavedConfig[] = savedConfigsStr ? JSON.parse(savedConfigsStr) : [];

      // Find the highest Untitled-X number
      let maxNumber = 0;
      savedConfigs.forEach((config) => {
        const match = config.name.match(/^Untitled-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNumber) maxNumber = num;
        }
      });

      // Create new name with incremented number
      nameToUse = `Untitled-${maxNumber + 1}`;
    }

    try {
      const now = Date.now();
      const configId = `config-${now}`;
      const newConfig: SavedConfig = {
        id: configId,
        name: nameToUse,
        config: rawConfigData,
        createdAt: now,
        updatedAt: now,
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
      const now = Date.now();
      const updatedConfig: SavedConfig = {
        ...selectedConfig,
        config: rawConfigData,
        updatedAt: now,
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
   * Opens the save dialog and prepares the configuration content
   */
  export const openSaveDialog = () => {
    rawConfigData = window.editor.getCurrentParticleSystemConfig();
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
              <button
                type="button"
                class="config-card"
                on:click={() => showOverwriteConfirmation(config)}
                on:keydown={(e) => e.key === 'Enter' && showOverwriteConfirmation(config)}
                aria-label="Select configuration to overwrite: {config.name}"
              >
                <div class="config-card-content">
                  <div class="config-name">{config.name}</div>
                  <div class="config-dates">
                    <div class="config-date">
                      Created: {formatDate(config.createdAt)}
                    </div>
                    <div class="config-date">
                      Modified: {formatDate(config.updatedAt)}
                    </div>
                  </div>
                </div>
              </button>
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

  .config-card {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    overflow: hidden;
    width: 100%;
    text-align: left;
    font-family: inherit;
    padding: 0;
    display: block;
  }

  :global(.dark-theme) .config-card {
    background-color: #2d2d2d;
    border: 1px solid #444;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .config-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  :global(.dark-theme) .config-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .config-card-content {
    padding: 12px;
  }

  .config-name {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
  }

  .config-dates {
    font-size: 12px;
    color: #666;
  }

  .config-date {
    margin-bottom: 2px;
    color: #666;
  }

  :global(.dark-theme) .config-name {
    color: #ffffff;
  }

  :global(.dark-theme) .config-dates,
  :global(.dark-theme) .config-date {
    color: #b0b0b0;
  }
</style>
