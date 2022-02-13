<script>
  import Button, { Label, Icon } from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";

  let lightTheme =
    typeof window === "undefined" ||
    window.matchMedia("(prefers-color-scheme: light)").matches;

  const switchTheme = () => {
    lightTheme = !lightTheme;
    let themeLink = document.head.querySelector("#theme");
    if (!themeLink) {
      themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.id = "theme";
    }
    themeLink.href = `./build/static/smui${lightTheme ? "" : "-dark"}.css`;
    document.head
      .querySelector('link[href="./build/static/smui-dark.css"]')
      ?.insertAdjacentElement("afterend", themeLink);
  };

  let open = false;

  const createNewRequest = () => (open = true);
  const createNew = () => window.editor.createNew();
</script>

<div class="wrapper">
  <div>
    <Button on:click={createNewRequest} variant="raised">
      <Icon class="material-icons">note_add</Icon><Label>New</Label>
    </Button>
    <Button on:click={window.editor.copyToClipboard} variant="raised">
      <Icon class="material-icons">file_copy</Icon><Label
        >Copy to clipboard</Label
      >
    </Button>
    <Button on:click={window.editor.loadFromClipboard} variant="raised">
      <Icon class="material-icons">content_paste</Icon><Label
        >Load from clipboard</Label
      >
    </Button>
  </div>
  <Button on:click={switchTheme}>
    <Label>{lightTheme ? "Lights off" : "Lights on"}</Label>
  </Button>
</div>

<Dialog
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">Do you want to create a new particle system?</Title>
  <Content id="simple-content">You will loose your current config.</Content>
  <Actions>
    <Button>
      <Icon class="material-icons">close</Icon><Label>No</Label>
    </Button>
    <Button on:click={createNew}>
      <Icon class="material-icons">check</Icon><Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .wrapper {
    width: 100%;
    background: var(--mdc-theme-background);
    display: flex;
    padding: 5px;
    border-bottom: 1px solid var(--border);
    justify-content: space-between;
  }
</style>
