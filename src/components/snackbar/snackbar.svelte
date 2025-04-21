<script>
  import { snackbarStore } from '../../js/stores/snackbar-store';

  // Variable to track visibility state
  let message = '';
  let timeout = 3000;
  let visible = false;

  snackbarStore.subscribe((value) => {
    if (value) {
      message = value.message;
      timeout = value.timeout || 3000;
      visible = true;

      // Auto-hide after timeout
      setTimeout(() => {
        visible = false;
      }, timeout);
    }
  });

  const dismiss = () => {
    visible = false;
  };
</script>

<div class="snackbar" class:visible>
  <div class="snackbar-content">
    <span class="snackbar-message">{message}</span>
    <button class="snackbar-dismiss" on:click={dismiss}>Dismiss</button>
  </div>
</div>

<style>
  .snackbar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s,
      visibility 0.3s;
  }

  .snackbar.visible {
    opacity: 1;
    visibility: visible;
  }

  .snackbar-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .snackbar-message {
    text-align: center;
  }

  .snackbar-dismiss {
    background-color: transparent;
    color: #4caf50;
    border: none;
    padding: 8px;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
  }
</style>
