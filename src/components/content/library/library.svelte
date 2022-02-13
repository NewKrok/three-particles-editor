<script>
  import { loadCustomAssets } from "./../../../js/three-particles-editor/assets.js";
  import FileUploader from "./file-uploader.svelte";
  import { Svroller } from "svrollbar";
  import { Input } from "@smui/textfield";
  import Paper from "@smui/paper";
  import { Icon } from "@smui/common";
  import LibraryItem from "./library-item.svelte";

  let rawList =
    JSON.parse(localStorage.getItem("particle-system-editor/library")) || [];
  let list = rawList;
  let filter = "";

  loadCustomAssets({
    textures: list.map(({ name, url }) => ({ id: name, url })),
    onComplete: () => console.log("DONE"),
  });

  const save = () =>
    localStorage.setItem(
      "particle-system-editor/library",
      JSON.stringify(rawList)
    );

  const handleKeyUp = () => {
    list = rawList.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const add = (url) => {
    const randomId = Math.floor(Math.random() * 10000);
    rawList.push({
      url,
      name: `CustomTexture-${randomId}`,
      id: `CustomTexture-${randomId}`,
    });
    list = rawList;
    save();
  };

  const remove = (id) => {
    rawList = rawList.filter(({ id: currentId }) => currentId !== id);
    list = rawList;
    save();
  };

  const rename = ({ id, name }) => {
    rawList = rawList.map((entry) => ({
      ...entry,
      name: entry.id === id ? name : entry.name,
    }));
    save();
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
  <FileUploader {add} />
</div>
<Svroller width="100%" height="calc(100% - 70px)">
  {#each list as item, i}
    <LibraryItem {...item} {remove} {rename} />
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
