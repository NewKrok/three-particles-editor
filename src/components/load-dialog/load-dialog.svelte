<script lang="ts">
  // Load dialog component for the Three Particles Editor
  import Button, { Label, Icon } from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import { showSuccessSnackbar, showErrorSnackbar } from '../../js/stores/snackbar-store';
  import { onMount } from 'svelte';
  import ConfigCard from '../config-card/config-card.svelte';

  /**
   * Whether the load dialog is open
   */
  export let open = false;

  /**
   * Selected configuration for loading
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
   * Saved configurations
   */
  type SavedConfig = {
    id: string;
    name: string;
    config: any;
    createdAt: number;
    updatedAt: number;
    editorVersion?: string;
  };

  let savedConfigs: SavedConfig[] = [];

  /**
   * Load saved configurations from localStorage
   */
  const loadSavedConfigs = (): void => {
    try {
      const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
      const allConfigs: SavedConfig[] = savedConfigsStr ? JSON.parse(savedConfigsStr) : [];
      // Sort by updatedAt (newest first)
      savedConfigs = allConfigs.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      // Reset configs on error
      savedConfigs = [];
    }
  };

  /**
   * Show confirmation dialog for loading a configuration
   */
  const showLoadConfirmation = (config: SavedConfig): void => {
    selectedConfig = config;
    confirmMessage = `Do you want to load the configuration "${config.name}"? Any unsaved changes will be lost.`;
    showConfirmDialog = true;
  };

  /**
   * Load the selected configuration
   */
  const loadConfig = (): void => {
    if (!selectedConfig) return;

    try {
      // Load the configuration into the editor
      // Using the correct method from the editor interface
      window.editor.load(selectedConfig.config);

      showSuccessSnackbar(`Configuration "${selectedConfig.name}" loaded successfully`);
      showConfirmDialog = false;
      open = false; // Close the main load dialog
    } catch (error) {
      // Show error message
      showErrorSnackbar('Failed to load configuration');
      showConfirmDialog = false;
    }
  };

  /**
   * Delete a configuration from localStorage
   */
  const deleteConfig = (configId: string): void => {
    try {
      // Get existing configs
      const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
      if (!savedConfigsStr) return;

      // Parse and filter out the config to delete
      const allConfigs: SavedConfig[] = JSON.parse(savedConfigsStr);
      const updatedConfigs = allConfigs.filter((config) => config.id !== configId);

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
   * Opens the load dialog and loads the saved configurations
   */
  export const openLoadDialog = () => {
    loadSavedConfigs();
    open = true;
  };

  /**
   * Paste configuration from clipboard
   */
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const config = JSON.parse(text);

      // Load the configuration into the editor
      // Using the correct method from the editor interface
      window.editor.load(config);

      showSuccessSnackbar('Configuration loaded from clipboard');
      open = false; // Close the load dialog
    } catch (error) {
      showErrorSnackbar(
        'Failed to load configuration from clipboard. Make sure the clipboard contains a valid particle system configuration.'
      );
    }
  };

  // Load saved configs on component mount
  onMount(() => {
    loadSavedConfigs();
  });
</script>

<Dialog bind:open aria-labelledby="load-dialog-title" aria-describedby="load-dialog-content">
  <!-- Confirmation Dialog -->
  {#if showConfirmDialog}
    <Dialog
      open={showConfirmDialog}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-content"
      scrimClickAction=""
      escapeKeyAction=""
    >
      <Title id="confirm-dialog-title">Confirm Load</Title>
      <Content id="confirm-dialog-content">{confirmMessage}</Content>
      <Actions>
        <Button on:click={() => (showConfirmDialog = false)}>
          <Label>Cancel</Label>
        </Button>
        <Button on:click={loadConfig}>
          <Icon class="material-icons">file_download</Icon><Label>Load</Label>
        </Button>
      </Actions>
    </Dialog>
  {/if}
  <Title id="load-dialog-title">Load Configuration</Title>
  <Content id="load-dialog-content">
    <div class="load-dialog-content">
      {#if savedConfigs.length > 0}
        <div class="saved-configs">
          <h3>Saved configurations</h3>
          <div class="config-cards">
            {#each savedConfigs as config}
              <ConfigCard
                {config}
                onClick={() => showLoadConfirmation(config)}
                on:delete={({ detail }) => deleteConfig(detail.configId)}
              />
            {/each}
          </div>
        </div>
      {:else}
        <div class="no-configs">
          <p>No saved configurations found.</p>
          <p>You can paste a configuration from clipboard or save a new configuration first.</p>
        </div>
      {/if}
    </div>
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>
      <Icon class="material-icons">close</Icon><Label>Close</Label>
    </Button>
    <Button on:click={pasteFromClipboard}>
      <Icon class="material-icons">content_paste</Icon><Label>Paste from Clipboard</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .load-dialog-content {
    width: 100%;
    min-width: 300px;
    max-width: 800px;
  }

  .saved-configs {
    margin-top: 8px;
  }

  .saved-configs h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--primary);
  }

  .config-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
    max-height: 60vh;
    overflow-y: auto;
    padding: 4px;
  }

  .no-configs {
    padding: 24px;
    text-align: center;
    color: var(--mdc-theme-text-secondary-on-background, #666);
  }

  .no-configs p {
    margin: 8px 0;
  }
</style>
