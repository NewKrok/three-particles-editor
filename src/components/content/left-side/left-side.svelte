<script lang="ts">
  import Tab, { Icon, Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Examples from '../examples/examples.svelte';
  import Library from '../library/library.svelte';
  import { onMount } from 'svelte';

  const STORAGE_KEY = 'leftPanelCollapsed';

  const tabs = [
    {
      icon: 'settings_suggest',
      label: 'Examples',
    },
    {
      icon: 'collections',
      label: 'Library',
    },
  ].map((entry, index) => ({ ...entry, index }));
  let active = tabs[0];

  // Panel state - exported to allow binding from parent components
  export let isCollapsed: boolean = false;

  // Load saved state on component mount
  onMount(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState !== null) {
        isCollapsed = savedState === 'true';
      }
    } catch (error) {
      console.error('Failed to load panel state from localStorage:', error);
    }
  });

  // Toggle panel collapsed state and save to localStorage
  const togglePanel = (): void => {
    isCollapsed = !isCollapsed;
    saveState();
  };

  // Save panel state to localStorage
  const saveState = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, isCollapsed.toString());
    } catch (error) {
      console.error('Failed to save panel state to localStorage:', error);
    }
  };
</script>

<div class="wrapper" class:collapsed={isCollapsed}>
  <!-- Full panel content - visible when expanded -->
  <div class="panel-content">
    <TabBar {tabs} let:tab bind:active>
      <Tab {tab}>
        <Icon class="material-icons">{tab.icon}</Icon>
        <Label>{tab.label}</Label>
      </Tab>
    </TabBar>

    {#if active.index === 0}
      <Examples />
    {:else if active.index === 1}
      <Library />
    {/if}
  </div>

  <!-- Collapsed panel with tab icons only -->
  <div class="collapsed-tabs">
    {#each tabs as tab}
      <button
        type="button"
        class="collapsed-tab-icon"
        class:active={active.index === tab.index}
        aria-label={tab.label}
        on:click={() => {
          active = tab;
          isCollapsed = false;
          saveState();
        }}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            active = tab;
            isCollapsed = false;
            saveState();
          }
        }}
      >
        <Icon class="material-icons">{tab.icon}</Icon>
      </button>
    {/each}
  </div>

  <!-- Toggle button at the bottom -->
  <button
    type="button"
    class="collapse-toggle"
    on:click={togglePanel}
    aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
  >
    <span class="material-icons">
      {isCollapsed ? 'chevron_right' : 'chevron_left'}
    </span>
  </button>
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 310px;
    height: 100%;
    max-height: 100%;
    background-color: var(--mdc-theme-background);
    border-right: 1px solid var(--border);
    display: flex;
    transition: width 0.3s ease;
    overflow: visible;
    z-index: 100;

    &.collapsed {
      width: 40px;

      .panel-content {
        opacity: 0;
        pointer-events: none;
      }

      .collapsed-tabs {
        opacity: 1;
        pointer-events: auto;
      }
    }

    .panel-content {
      width: 100%;
      height: 100%;
      opacity: 1;
      transition: opacity 0.2s ease;
    }

    .collapsed-tabs {
      position: absolute;
      top: 10px;
      left: 0;
      width: 40px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 5px 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;

      .collapsed-tab-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 30px;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 3px 8px;
        color: inherit;
        outline: none;

        &:hover,
        &:focus {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &:focus-visible {
          outline: 1px solid var(--mdc-theme-primary);
        }

        &.active {
          color: var(--mdc-theme-primary);
        }
      }
    }

    .collapse-toggle {
      position: absolute;
      bottom: 10px;
      z-index: 10;
      background-color: var(--mdc-theme-background);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 30px;
      height: 30px;
      padding: 0;
      outline: none;
      color: inherit;
      transition:
        right 0.3s ease,
        border-radius 0.3s ease,
        border 0.3s ease;

      /* Expanded state - outside the panel */
      right: -30px;
      border-radius: 0 4px 4px 0;
      border: 1px solid var(--border);
      border-left: none;

      .collapsed & {
        /* Collapsed state - inside the panel */
        right: 5px;
        border-radius: 4px;
        border: 1px solid var(--border);
      }

      .material-icons {
        font-size: 22px;
      }

      &:hover,
      &:focus {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &:focus-visible {
        outline: 1px solid var(--mdc-theme-primary);
      }
    }
  }
</style>
