<script lang="ts">
  import Button, { Label, Icon } from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import AboutModal from '../about-modal/about-modal.svelte';
  import SaveDialog from '../save-dialog/save-dialog.svelte';
  import LoadDialog from '../load-dialog/load-dialog.svelte';
  import { showSuccessSnackbar } from '../../js/stores/snackbar-store';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Focus action for automatically focusing input elements
  const focus = (node: HTMLElement) => {
    node.focus();
    return {};
  };

  // Initialize theme from localStorage or system preference
  let lightTheme = true;

  // Function to get saved theme preference
  const getSavedTheme = () => {
    if (typeof window === 'undefined') return true;

    const savedTheme = localStorage.getItem('threeParticlesEditorTheme');
    if (savedTheme !== null) {
      return savedTheme === 'light';
    }

    // Fall back to system preference if no saved preference
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  };

  const switchTheme = () => {
    lightTheme = !lightTheme;

    // Save theme preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('threeParticlesEditorTheme', lightTheme ? 'light' : 'dark');
    }

    // Update theme in the DOM
    let themeLink = document.head.querySelector('#theme') as HTMLLinkElement;
    if (!themeLink) {
      themeLink = document.createElement('link') as HTMLLinkElement;
      themeLink.rel = 'stylesheet';
      themeLink.id = 'theme';
    }
    themeLink.href = `./build/static/smui${lightTheme ? '' : '-dark'}.css`;
    document.head
      .querySelector('link[href="./build/static/smui-dark.css"]')
      ?.insertAdjacentElement('afterend', themeLink);
  };

  let open = false;
  let aboutModalOpen = false;
  let mobileMenuOpen = false;
  let saveDialogOpen = false;
  let loadDialogOpen = false;

  // Current configuration metadata
  let configName = writable('Untitled');
  let lastModified = writable('');

  // State for config name editing
  let isEditingName = false;
  let editedConfigName = '';

  // Flag to prevent automatic updates from overwriting user edits
  let userEditedName = false;

  const createNewRequest = () => (open = true);
  const createNew = () => {
    window.editor.createNew();
    updateConfigInfo();
  };

  // Reference to the SaveDialog component
  let saveDialogComponent;

  // Reference to the LoadDialog component
  let loadDialogComponent;

  // Function to open the save dialog (Save As)
  const openSaveDialog = () => {
    if (saveDialogComponent) {
      saveDialogComponent.openSaveDialog();
      // Update config info after saving
      setTimeout(updateConfigInfo, 500);
    }
  };

  // Function to directly save the configuration without opening the dialog
  const quickSave = () => {
    if (saveDialogComponent) {
      saveDialogComponent.quickSave();
      // Update config info after saving
      setTimeout(updateConfigInfo, 500);
    }
  };

  // Function to open the load dialog
  const openLoadDialog = () => {
    if (loadDialogComponent) {
      loadDialogComponent.openLoadDialog();
    }
  };

  /**
   * Copies the current particle system configuration to clipboard
   */
  const copyToClipboard = () => {
    window.editor.copyToClipboard();
    showSuccessSnackbar('Particle system configuration copied to clipboard');
  };

  // Function to update configuration info in the header
  const updateConfigInfo = () => {
    try {
      const metadata = window.editor.getConfigMetadata();
      if (metadata) {
        // Only update the config name if the user hasn't edited it
        if (!userEditedName) {
          // Update config name
          configName.set(metadata.name || 'Untitled');
        }

        // Format the last modified date
        if (metadata.modifiedAt) {
          const date = new Date(metadata.modifiedAt);
          lastModified.set(date.toLocaleString());
        } else {
          lastModified.set('');
        }
      }
    } catch (error) {
      // Silent error - we don't want to break the UI if metadata can't be updated
      // This could happen during initialization before the editor is fully loaded
    }
  };

  /**
   * Starts editing the configuration name
   */
  const startEditingName = () => {
    editedConfigName = $configName;
    isEditingName = true;
  };

  /**
   * Saves the edited configuration name
   */
  const saveConfigName = () => {
    if (editedConfigName.trim() !== '') {
      // Update the config name in the store
      configName.set(editedConfigName);

      // Set the flag to prevent automatic updates from overwriting our change
      userEditedName = true;

      // Update the name in the editor's metadata and configuration
      try {
        if (window.editor) {
          // Try all possible ways to update the name in the editor
          // Use type safety with proper checks to avoid TypeScript errors

          // 1. Try to update via the metadata (most reliable method)
          if (typeof window.editor.getConfigMetadata === 'function') {
            const metadata = window.editor.getConfigMetadata();
            if (metadata && typeof metadata === 'object') {
              // Use type assertion to avoid TypeScript errors
              (metadata as any).name = editedConfigName;

              // Try to save the updated metadata if possible
              if (typeof (window.editor as any).setConfigMetadata === 'function') {
                (window.editor as any).setConfigMetadata(metadata);
              }
            }
          }

          // 2. Try to access editor's internal config if available
          const editorAny = window.editor as any;
          if (editorAny.config && typeof editorAny.config === 'object') {
            editorAny.config.name = editedConfigName;
          }

          // 3. Try other possible methods that might exist
          if (
            typeof editorAny.updateConfig === 'function' &&
            typeof editorAny.getConfig === 'function'
          ) {
            try {
              const config = editorAny.getConfig();
              if (config && typeof config === 'object') {
                config.name = editedConfigName;
                editorAny.updateConfig(config);
              }
            } catch (e) {
              // Silent error - this method might not work as expected
            }
          }

          // 4. Try to save the configuration to persist changes
          if (typeof editorAny.saveConfig === 'function') {
            try {
              editorAny.saveConfig();
            } catch (e) {
              // Silent error - this method might not exist
            }
          }
        }
      } catch (error) {
        // Silent error - we don't want to break the UI if the update fails
      }
    }
    isEditingName = false;
  };

  /**
   * Handles key press events when editing the configuration name
   */
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      saveConfigName();
    } else if (event.key === 'Escape') {
      isEditingName = false;
    }
  };

  onMount(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = getSavedTheme();

    // Only apply the theme if it's different from the current state
    if (savedTheme !== lightTheme) {
      lightTheme = savedTheme;

      // Apply the theme without toggling
      let themeLink = document.head.querySelector('#theme') as HTMLLinkElement;
      if (!themeLink) {
        themeLink = document.createElement('link') as HTMLLinkElement;
        themeLink.rel = 'stylesheet';
        themeLink.id = 'theme';
      }
      themeLink.href = `./build/static/smui${lightTheme ? '' : '-dark'}.css`;
      document.head
        .querySelector('link[href="./build/static/smui-dark.css"]')
        ?.insertAdjacentElement('afterend', themeLink);
    }

    // Initialize config info
    updateConfigInfo();

    // Set up an interval to update config info periodically
    const infoUpdateInterval = setInterval(updateConfigInfo, 2000);

    // When a new config is created, reset the userEditedName flag
    let originalCreateNew: Function | undefined;
    if (window.editor && typeof window.editor.createNew === 'function') {
      originalCreateNew = window.editor.createNew;
      (window.editor as any).createNew = function (...args: any[]) {
        userEditedName = false;
        return originalCreateNew?.apply(this, args);
      };
    }

    return () => {
      // Clean up interval on component unmount
      clearInterval(infoUpdateInterval);

      // Restore original method if we modified it
      if (originalCreateNew && window.editor) {
        (window.editor as any).createNew = originalCreateNew;
      }
    };
  });

  const checkMobile = () => {
    isMobile = window.innerWidth < 768;
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  // Detect if we're on a mobile device
  let isMobile = false;

  if (typeof window !== 'undefined') {
    // Check on load
    checkMobile();

    // Update on resize
    window.addEventListener('resize', checkMobile);
  }
</script>

<div class="wrapper">
  <div class="left-section">
    <button
      class="logo-button"
      on:click={() => (aboutModalOpen = true)}
      on:keydown={(e) => e.key === 'Enter' && (aboutModalOpen = true)}
      title="About Three Particles Editor"
      aria-label="About Three Particles Editor"
    >
      <img src="./assets/images/logo-colorful.png" alt="Three Particles Logo" class="logo" />
    </button>

    <!-- Configuration info section -->
    <div class="config-info">
      <div class="config-name-container">
        {#if isEditingName}
          <!-- Editable input field with expanded container -->
          <div class="config-name-edit-container">
            <input
              type="text"
              class="config-name-input"
              bind:value={editedConfigName}
              on:blur={saveConfigName}
              on:keydown={handleKeyPress}
              aria-label="Edit configuration name"
              use:focus
              placeholder="Enter configuration name"
              maxlength="50"
            />
          </div>
        {:else}
          <!-- Display mode with hover effect -->
          <button
            class="config-name-wrapper"
            on:click={startEditingName}
            on:keydown={(e) => e.key === 'Enter' && startEditingName()}
            aria-label="Edit configuration name"
            type="button"
          >
            <div class="config-name" title="Click to edit configuration name">{$configName}</div>
            <span class="edit-icon material-icons">edit</span>
          </button>
        {/if}
      </div>
      {#if $lastModified}
        <div class="last-modified" title="Last modified">{$lastModified}</div>
      {/if}
    </div>
  </div>

  {#if !isMobile}
    <!-- Desktop layout -->
    <div class="center-section">
      <Button on:click={createNewRequest} variant="raised">
        <Icon class="material-icons">note_add</Icon><Label>New</Label>
      </Button>
      <Button on:click={openLoadDialog} variant="raised">
        <Icon class="material-icons">folder_open</Icon><Label>Load</Label>
      </Button>
      <Button on:click={quickSave} variant="raised">
        <Icon class="material-icons">save</Icon><Label>Save</Label>
      </Button>
      <Button on:click={openSaveDialog} variant="raised">
        <Icon class="material-icons">save_as</Icon><Label>Save As</Label>
      </Button>
      <Button on:click={copyToClipboard} variant="raised">
        <Icon class="material-icons">file_copy</Icon><Label>Copy</Label>
      </Button>
      <Button on:click={window.editor.loadFromClipboard} variant="raised">
        <Icon class="material-icons">content_paste</Icon><Label>Paste</Label>
      </Button>
    </div>
    <div class="right-section">
      <Button on:click={switchTheme} variant="raised">
        <Icon class="material-icons">{lightTheme ? 'dark_mode' : 'light_mode'}</Icon>
        <Label>{lightTheme ? 'Dark mode' : 'Light mode'}</Label>
      </Button>
    </div>
  {:else}
    <!-- Mobile layout -->
    <div class="mobile-controls">
      <!-- Theme toggle button -->
      <button class="icon-button" on:click={switchTheme}>
        <span class="material-icons">{lightTheme ? 'dark_mode' : 'light_mode'}</span>
      </button>

      <!-- Menu button -->
      <button
        type="button"
        class="menu-item"
        on:click={openLoadDialog}
        on:keydown={(e) => e.key === 'Enter' && openLoadDialog()}
        aria-label="Load configuration"
      >
        <Icon class="material-icons">folder_open</Icon> Load
      </button>
      <button
        type="button"
        class="menu-item"
        on:click={quickSave}
        on:keydown={(e) => e.key === 'Enter' && quickSave()}
        aria-label="Save configuration"
      >
        <Icon class="material-icons">save</Icon> Save
      </button>
      <button
        type="button"
        class="menu-item"
        on:click={openSaveDialog}
        on:keydown={(e) => e.key === 'Enter' && openSaveDialog()}
        aria-label="Save configuration as"
      >
        <Icon class="material-icons">save_as</Icon> Save As
      </button>
      <button class="icon-button" on:click={toggleMobileMenu}>
        <span class="material-icons">menu</span>
      </button>

      <!-- Mobile dropdown menu -->
      {#if mobileMenuOpen}
        <div class="mobile-menu" class:dark-theme={!lightTheme}>
          <button
            class="menu-item"
            on:click={() => {
              createNewRequest();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">note_add</span>
            <span>New</span>
          </button>
          <button
            class="menu-item"
            on:click={() => {
              quickSave();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">save</span>
            <span>Save</span>
          </button>
          <button
            class="menu-item"
            on:click={() => {
              openSaveDialog();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">save_as</span>
            <span>Save As</span>
          </button>
          <button
            class="menu-item"
            on:click={() => {
              copyToClipboard();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">file_copy</span>
            <span>Copy</span>
          </button>
          <button
            class="menu-item"
            on:click={() => {
              window.editor.loadFromClipboard();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">content_paste</span>
            <span>Paste</span>
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
  <Title id="simple-title">Do you want to create a new particle system?</Title>
  <Content id="simple-content">You will loose your current config.</Content>
  <Actions>
    <Button>
      <Icon class="material-icons">close</Icon><Label>No</Label>
    </Button>
    <Button on:click={createNew}>
      <Icon class="material-icons">check</Icon><Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>

<AboutModal bind:open={aboutModalOpen} />

<SaveDialog bind:open={saveDialogOpen} bind:this={saveDialogComponent} />

<LoadDialog bind:open={loadDialogOpen} bind:this={loadDialogComponent} />

<style lang="scss">
  .wrapper {
    width: 100%;
    background: var(--mdc-theme-background);
    display: flex;
    padding: 5px 10px;
    border-bottom: 1px solid var(--border);
    justify-content: space-between;
    align-items: center;
  }

  .left-section {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
  }

  .config-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 4px;
  }

  .config-name-container {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 10;
  }

  .config-name-edit-container {
    position: absolute;
    top: -12px;
    left: -10px;
    z-index: 20;
    min-width: 200px;
  }

  .config-name-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 4px;
    border-radius: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover,
    &:focus {
      background-color: rgba(255, 62, 0, 0.1);

      .edit-icon {
        opacity: 1;
      }
    }
  }

  .config-name {
    font-weight: 500;
    font-size: 14px;
    color: var(--mdc-theme-primary, #ff3e00);
  }

  .edit-icon {
    font-size: 16px;
    color: var(--mdc-theme-primary, #ff3e00);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .config-name-input {
    font-weight: 500;
    font-size: 16px;
    color: var(--mdc-theme-primary, #ff3e00);
    background: var(--mdc-theme-surface, #fff);
    border: 1px solid var(--mdc-theme-primary, #ff3e00);
    border-radius: 4px;
    padding: 8px 10px;
    outline: none;
    width: 100%;
    min-width: 240px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease-in-out;

    &:focus {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    }
  }

  .last-modified {
    font-size: 12px;
    color: var(--mdc-theme-text-secondary-on-background, #666);
    opacity: 0.8;
  }

  .center-section {
    display: flex;
    gap: 8px;
    flex-grow: 0;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .right-section {
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    position: relative;
  }

  .icon-button {
    border: none;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #ff3e00;
    box-shadow:
      0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }

  .icon-button:hover {
    opacity: 0.9;
  }

  .icon-button .material-icons {
    color: white;
  }

  .mobile-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 100;
    margin-top: 4px;
    min-width: 180px;
    overflow: hidden;

    &.dark-theme {
      background-color: #222;
      border-color: #333;
      color: white;

      .menu-item {
        color: #fff;

        &:hover {
          background-color: #333;
        }
      }
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    width: 100%;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    color: #333;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .logo-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .logo {
    height: 36px;
    vertical-align: middle;
  }
</style>
