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

<div>
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
  {#each list as example (example.name)}
    <Example {...example} />
  {/each}
</Svroller>

<style lang="scss">
  * :global(.solo-paper) {
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 600px;
    padding: 0 12px;
    height: 48px;
    margin: 16px;
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
