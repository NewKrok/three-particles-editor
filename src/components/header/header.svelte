<script>
  import Button, { Label, Icon } from "@smui/button";
</script>

<div class="wrapper">
  <Button on:click={window.editor.reset} variant="raised">
    <Icon class="material-icons">note_add</Icon><Label>New</Label>
  </Button>
  <Button on:click={window.editor.copyToClipboard} variant="raised">
    <Icon class="material-icons">file_copy</Icon><Label>Copy to clipboard</Label
    >
  </Button>
  <Button on:click={window.editor.loadFromClipboard} variant="raised">
    <Icon class="material-icons">content_paste</Icon><Label
      >Load from clipboard</Label
    >
  </Button>
</div>

<style>
  .wrapper {
    width: 100%;
    background: #222;
    display: flex;
    gap: 3px;
    padding: 3px;
    border-bottom: 1px solid #333;
  }
</style>
