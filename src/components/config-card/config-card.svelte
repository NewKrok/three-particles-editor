<script lang="ts">
  /**
   * Configuration card component for the Three Particles Editor
   * Displays a saved configuration with its name and timestamps
   */
  import { createEventDispatcher } from 'svelte';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label, Icon } from '@smui/button';

  const dispatch = createEventDispatcher<{
    delete: { configId: string };
  }>();

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

  /**
   * State for delete confirmation dialog
   */
  let showDeleteConfirmation = false;

  /**
   * Show delete confirmation dialog
   */
  const confirmDelete = (event: MouseEvent): void => {
    event.stopPropagation(); // Prevent card click
    showDeleteConfirmation = true;
  };

  /**
   * Handle delete confirmation
   */
  const handleDelete = (): void => {
    dispatch('delete', { configId: config.id });
    showDeleteConfirmation = false;
  };
</script>

<!-- Delete Confirmation Dialog -->
{#if showDeleteConfirmation}
  <Dialog
    open={showDeleteConfirmation}
    aria-labelledby="delete-confirm-title"
    aria-describedby="delete-confirm-content"
  >
    <Title id="delete-confirm-title">Confirm Deletion</Title>
    <Content id="delete-confirm-content">
      <p>Are you sure you want to delete the configuration "{config.name}"?</p>
      <p>This action cannot be undone.</p>
    </Content>
    <Actions>
      <Button on:click={() => (showDeleteConfirmation = false)}>
        <Label>Cancel</Label>
      </Button>
      <Button on:click={handleDelete}>
        <Icon class="material-icons">delete</Icon>
        <Label>Delete</Label>
      </Button>
    </Actions>
  </Dialog>
{/if}

<div class="config-card-container">
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

  <button
    type="button"
    class="delete-button"
    on:click={confirmDelete}
    aria-label="Delete configuration: {config.name}"
  >
    <Icon class="material-icons">delete</Icon>
  </button>
</div>

<style lang="scss">
  .config-card-container {
    position: relative;
    width: 100%;
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

  .delete-button {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background-color: rgba(255, 0, 0, 0.1);
    color: #d32f2f;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition:
      opacity 0.2s,
      background-color 0.2s;
    z-index: 2;
  }

  :global(.dark-theme) .delete-button {
    background-color: rgba(255, 0, 0, 0.2);
    color: #f44336;
  }

  .delete-button:hover {
    background-color: rgba(255, 0, 0, 0.2);
  }

  :global(.dark-theme) .delete-button:hover {
    background-color: rgba(255, 0, 0, 0.3);
  }

  .config-card-container:hover .delete-button {
    opacity: 1;
  }
</style>
