<script>
  import Card, { PrimaryAction, Media, Content } from "@smui/card";
  import Dialog, {
    Title,
    Content as DialogContent,
    Actions,
  } from "@smui/dialog";
  import Button, { Icon, Label } from "@smui/button";
  import Textfield from "@smui/textfield";

  export let id, name, url, rename, remove;
  export let isDefault = null;

  const normalizedUrl = typeof url === "function" ? url() : url;

  let open = false;

  $: if (name || name === "") rename({ id, name });

  const removeRequest = () => (open = true);
</script>

<div class="wrapper">
  <Card>
    <Media class="card-media-square" aspectRatio="square">
      <div class="transparent-background" />
      <div
        class="media-background"
        style={`background-image: url(${normalizedUrl})`}
      />
      <div class="circle-preview" />
    </Media>
    <Content class="mdc-typography--body2">
      {#if isDefault}
        <div class="default-name">{name}</div>
      {:else}
        <Textfield bind:value={name} />
        <PrimaryAction on:click={removeRequest}>
          <Icon class="material-icons">delete</Icon>
        </PrimaryAction>
      {/if}
    </Content>
  </Card>
</div>

<Dialog
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">Delete {name}</Title>
  <DialogContent id="simple-content"
    >Are you sure you want to delete this image?</DialogContent
  >
  <Actions>
    <Button>
      <Icon class="material-icons">close</Icon><Label>No</Label>
    </Button>
    <Button on:click={() => remove(id)}>
      <Icon class="material-icons">check</Icon><Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .wrapper {
    margin: 16px;
    border: 1px solid var(--border);
    border-radius: 4px;

    .circle-preview {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      border: 1px dashed var(--mdc-theme-on-surface);
      border-radius: 50%;
    }

    .transparent-background {
      background-image: url(./static/transparent.webp);
      background-repeat: repeat;
      background-size: 10%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .media-background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .default-name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  * :global(.mdc-typography--body2) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
