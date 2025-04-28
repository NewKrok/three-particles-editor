<script lang="ts">
  /**
   * Configuration card component for the Three Particles Editor
   * Displays a saved configuration with its name and timestamps
   */

  /**
   * Configuration data
   */
  export let config: {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
  };

  /**
   * Click handler for the card
   */
  export let onClick: () => void;

  /**
   * Format date for display
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };
</script>

<button
  type="button"
  class="config-card"
  on:click={onClick}
  on:keydown={(e) => e.key === 'Enter' && onClick()}
  aria-label="Select configuration: {config.name}"
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

<style lang="scss">
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
