<script lang="ts">
  import ControlPanel from './control-panel/control-panel.svelte';
  import LeftSide from './left-side/left-side.svelte';

  // Track the left panel's collapsed state
  let isLeftPanelCollapsed: boolean = false;
</script>

<div class="wrapper">
  <div id="three-particles-editor" />
  <div class="stats" class:collapsed={isLeftPanelCollapsed} />
  <LeftSide bind:isCollapsed={isLeftPanelCollapsed} />
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
  <div class="gradient-editor-modal" style="display: none;">
    <div class="gradient-editor-modal__content">
      <div class="gradient-editor-modal__header">
        <h2>Gradient Editor</h2>
        <div class="gradient-editor-modal__header-buttons">
          <button class="gradient-editor-modal__info" title="Toggle controls info">?</button>
          <button class="gradient-editor-modal__close">×</button>
        </div>
      </div>
      <div class="gradient-editor-modal__body">
        <div class="gradient-editor-wrapper">
          <canvas class="gradient-editor-canvas"></canvas>
        </div>
        <div class="gradient-editor-info" style="display: none;">
          <p>Click on the gradient bar to add stops</p>
          <p>Double-click a stop to edit color</p>
          <p>Right-click a stop to delete (except first/last)</p>
          <p>Drag stops to reposition</p>
        </div>
        <div class="gradient-editor-presets"></div>
      </div>
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
      transition: all 0.3s ease;

      :global(> div) {
        left: 310px !important;
        position: absolute !important;
        transition: left 0.3s ease;
      }

      &.collapsed {
        :global(> div) {
          left: 40px !important;
        }
      }
    }
  }
</style>
