<script>
  import { snackbarStore } from '../../js/stores/snackbar-store';

  // Variables to track snackbar state
  let message = '';
  let timeout = 3000;
  let visible = false;
  let type = 'default';

  // Map of type to CSS class
  const typeClasses = {
    default: '',
    success: 'snackbar-success',
    error: 'snackbar-error',
    warning: 'snackbar-warning',
    info: 'snackbar-info',
  };

  snackbarStore.subscribe((value) => {
    if (value) {
      message = value.message;
      timeout = value.timeout || 3000;
      type = value.type || 'default';
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

<div class="snackbar {typeClasses[type]}" class:visible>
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

  .snackbar-success {
    background-color: #4caf50;
  }

  .snackbar-error {
    background-color: #f44336;
  }

  .snackbar-warning {
    background-color: #ff9800;
  }

  .snackbar-info {
    background-color: #2196f3;
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
    color: white;
    border: none;
    padding: 8px;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
  }
</style>
