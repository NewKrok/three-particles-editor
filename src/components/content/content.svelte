<script>
  import ControlPanel from './control-panel/control-panel.svelte';
  import LeftSide from './left-side/left-side.svelte';
</script>

<div class="wrapper">
  <div id="three-particles-editor" />
  <div class="stats" />
  <LeftSide />
  <ControlPanel />
  <div class="right-panel">
    <div class="curve-editor">
      <div class="curve-editor__title">Bezier curve editor</div>
      <div class="curve-editor__content">
        <canvas class="curve-editor__canvas" width="300px" height="200px" />
        <div class="draggable-points" />
      </div>
      <div class="curve-editor__predefined-list" />
    </div>
  </div>
</div>

<style lang="scss">
  .wrapper {
    width: 100%;
    height: calc(100% - 43px);
    max-height: 100%;
    max-width: 100%;
    background: #ccc;
    display: flex;
    position: relative;

    .stats {
      position: absolute;
      left: 5px;
      top: 5px;

      :global(> div) {
        left: 310px !important;
        position: absolute !important;
      }
    }
  }
</style>
