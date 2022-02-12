<script>
  import { Svroller } from "svrollbar";
  import { particleExamples } from "../../../examples-config";
  import { Input } from "@smui/textfield";
  import Paper from "@smui/paper";
  import { Icon } from "@smui/common";

  import Example from "./example.svelte";

  let list = particleExamples;
  let filter = "";

  const handleKeyUp = () => {
    list = particleExamples.filter(
      ({ name, config }) =>
        name.toLowerCase().includes(filter.toLowerCase()) ||
        config.toLowerCase().includes(filter.toLowerCase())
    );
  };
</script>

<div class="wrapper">
  <div class="header">
    <h3 class="examples">Examples</h3>
    <Paper class="solo-paper" elevation={6}>
      <Icon class="material-icons">search</Icon>
      <Input
        bind:value={filter}
        on:keyup={handleKeyUp}
        placeholder="Search"
        class="solo-input"
      />
    </Paper>
  </div>
  <Svroller width="100%" height="calc(100% - 70px)">
    {#each list as example, i}
      <Example {...example} />
    {/each}
  </Svroller>
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 250px;
    height: 100%;
    max-height: 100%;
    background-color: var(--mdc-theme-background);
    border-right: 1px solid var(--border);

    .header {
      padding: 0 16px 16px;
    }
  }

  * :global(.solo-paper) {
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 600px;
    padding: 0 12px;
    height: 48px;
  }
  * :global(.solo-paper > *) {
    display: inline-block;
    margin: 0 12px;
  }
  * :global(.solo-input) {
    flex-grow: 1;
    color: var(--mdc-theme-on-surface, #000);
  }
  * :global(.solo-input::placeholder) {
    color: var(--mdc-theme-on-surface, #000);
    opacity: 0.6;
  }
</style>
