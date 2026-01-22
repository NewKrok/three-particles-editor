<script lang="ts">
  import { onMount } from 'svelte';

  export let floating: boolean = false;
  export let fullWidth: boolean = false;
  export let utmCampaign: string = 'floating_button';

  const kofiId = 'S6S01SSL5G';
  const kofiUrl = `https://ko-fi.com/${kofiId}/?utm_source=three-particles-editor&utm_medium=web&utm_campaign=${utmCampaign}`;

  let leftPanelCollapsed = false;

  const handleClick = () => {
    window.open(kofiUrl, '_blank', 'noopener,noreferrer');
  };

  // Check if left panel is collapsed by checking localStorage
  onMount(() => {
    try {
      const savedState = localStorage.getItem('leftPanelCollapsed');
      leftPanelCollapsed = savedState === 'true';
    } catch (error) {
      console.error('Failed to load panel state:', error);
    }

    // Listen for storage changes to update the position
    const handleStorageChange = () => {
      try {
        const savedState = localStorage.getItem('leftPanelCollapsed');
        leftPanelCollapsed = savedState === 'true';
      } catch (error) {
        console.error('Failed to load panel state:', error);
      }
    };

    // Poll for changes every 100ms (since we're in the same window)
    const interval = setInterval(handleStorageChange, 100);

    return () => clearInterval(interval);
  });
</script>

<button
  type="button"
  class="ko-fi-button"
  class:floating
  class:full-width={fullWidth}
  class:panel-collapsed={leftPanelCollapsed && floating}
  on:click={handleClick}
  aria-label="Support me on Ko-fi"
  title="Support me on Ko-fi"
>
  <svg
    class="ko-fi-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path
      d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"
    />
  </svg>
  <span class="ko-fi-text">Support me</span>
</button>

<style lang="scss">
  .ko-fi-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #ff5e5b;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: #ff4744;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &.floating {
      position: fixed;
      bottom: 50px;
      left: 320px;
      z-index: 99;
      padding: 10px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: left 0.3s ease;

      &.panel-collapsed {
        left: 50px;
      }

      @media (max-width: 768px) {
        bottom: 10px;
        left: 10px;
        padding: 8px 12px;
        font-size: 12px;

        &.panel-collapsed {
          left: 10px;
        }

        .ko-fi-icon {
          width: 18px;
          height: 18px;
        }
      }
    }

    &.full-width {
      width: 100%;
      margin-top: 16px;
    }

    .ko-fi-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .ko-fi-text {
      white-space: nowrap;
    }
  }
</style>
