<script lang="ts">
  import Card, { Actions } from "@smui/card";
  import Button, { Label } from "@smui/button";
  import IconButton, { Icon } from "@smui/icon-button";
</script>

<div class="wrapper">
  <Card>
    <Actions>
      <Button on:click={window.editor.play}>
        <Icon class="material-icons">play_arrow</Icon><Label>Play</Label>
      </Button>
      <Button on:click={window.editor.pause}>
        <Icon class="material-icons">pause</Icon><Label>Pause</Label>
      </Button>
      <Button on:click={window.editor.reset}>
        <Icon class="material-icons">replay</Icon><Label>Reset</Label>
      </Button>
    </Actions>
  </Card>
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    bottom: 10px;
    right: 320px;
    border: 1px solid var(--border);
    border-radius: 4px;
  }
</style>
