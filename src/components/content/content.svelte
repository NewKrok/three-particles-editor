<div class="wrapper">
  <div id="three-particles-editor" />
  <div class="stats" />
  <div class="left-panel">
    <div id="show-hide-button" class="simple-button">Show / Hide examples</div>
    <div id="example-list" />
  </div>
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
        left: 250px !important;
        position: absolute !important;
      }
    }
  }
</style>
