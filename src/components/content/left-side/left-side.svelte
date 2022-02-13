<script>
  import Tab, { Icon, Label } from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  import Examples from "../examples/examples.svelte";
  import Library from "../library/library.svelte";

  const tabs = [
    {
      icon: "settings_suggest",
      label: "Examples",
    },
    {
      icon: "collections",
      label: "Library",
    },
  ].map((entry, index) => ({ ...entry, index }));
  let active = tabs[0];
</script>

<div class="wrapper">
  <TabBar {tabs} let:tab bind:active>
    <Tab {tab}>
      <Icon class="material-icons">{tab.icon}</Icon>
      <Label>{tab.label}</Label>
    </Tab>
  </TabBar>

  {#if active.index === 0}
    <Examples />
  {:else if active.index === 1}
    <Library />
  {/if}
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 310px;
    height: 100%;
    max-height: 100%;
    background-color: var(--mdc-theme-background);
    border-right: 1px solid var(--border);
  }
</style>
