<script>
  import {
    getTexture,
    loadCustomAssets,
  } from "./../../../js/three-particles-editor/assets";
  import FileUploader from "./file-uploader.svelte";
  import { Svroller } from "svrollbar";
  import { Input } from "@smui/textfield";
  import Paper from "@smui/paper";
  import { Icon } from "@smui/common";
  import LibraryItem from "./library-item.svelte";
  import {
    textureConfigs,
    TextureId,
  } from "./../../../js/three-particles-editor/texture-config";

  const defaultList = Object.keys(TextureId)
    .filter(
      (key) =>
        textureConfigs.find(({ id }) => id === TextureId[key]).isParticleTexture
    )
    .map((key, index) => ({
      id: index,
      name: key,
      url: () => getTexture(TextureId[key]).url,
      isDefault: true,
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  let rawList =
    JSON.parse(localStorage.getItem("particle-system-editor/library")) || [];
  let list = rawList.concat(defaultList);
  let filter = "";

  const save = () => {
    localStorage.setItem(
      "particle-system-editor/library",
      JSON.stringify(rawList)
    );
    window.editor.updateAssets();
  };

  const handleKeyUp = () => {
    list = rawList
      .filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()))
      .concat(defaultList);
  };

  const add = (url) => {
    const randomId = Math.floor(Math.random() * 100000000);
    const randomName = `CustomTexture-${Math.floor(Math.random() * 1000)}`;
    const entry = {
      url,
      name: randomName,
      id: randomId,
    };
    rawList.unshift(entry);
    list = rawList.concat(defaultList);
    loadCustomAssets({
      textures: [{ ...entry, id: entry.name }],
      onComplete: save,
    });
  };

  const remove = (id) => {
    rawList = rawList.filter(({ id: currentId }) => currentId !== id);
    list = rawList.concat(defaultList);
    save();
  };

  const rename = ({ id, name }) => {
    const currentEntry = rawList.find((entry) => entry.id === id);
    if (currentEntry) {
      const particleSystemConfig =
        window.editor.getCurrentParticleSystemConfig();
      if (particleSystemConfig._editorData.textureId === currentEntry.name)
        particleSystemConfig._editorData.textureId = name;
      textureConfigs.forEach(
        (entry) => (entry.id = entry.id === currentEntry.name ? name : entry.id)
      );
    }
    rawList = rawList.map((entry) => ({
      ...entry,
      name: entry.id === id ? name : entry.name,
    }));

    save();
  };
</script>

<div class="head">
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
<Svroller width="100%" height="calc(100% - 95px)">
  {#each list as item (item.id)}
    <LibraryItem {...item} {remove} {rename} />
  {/each}
</Svroller>

<style lang="scss">
  .head {
    margin-bottom: 16px;
  }

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
