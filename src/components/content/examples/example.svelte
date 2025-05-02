<script>
  export let { name, preview = null, config = null } = {};
  import Card, { PrimaryAction, Media, Content } from '@smui/card';
  import Dialog, { Title, Content as DialogContent, Actions } from '@smui/dialog';
  import Button, { Icon, Label } from '@smui/button';
  import { toUrlFriendlyString } from '../../../js/utils/name-utils';

  let open = false;

  const loadRequest = () => (open = true);

  const load = () => {
    if (!config) {
      const nameAsKey = toUrlFriendlyString(name);
      fetch('./examples/' + nameAsKey + '/config.json')
        .then((response) => response.json())
        .then((data) => {
          window.editor.load(data);
        });
    } else {
      window.editor.load(JSON.parse(config));
    }
  };
</script>

<div class="wrapper">
  <Card>
    <PrimaryAction on:click={loadRequest}>
      <Media
        class="card-media-16x9"
        aspectRatio="16x9"
        style={`background-image: url(${
          preview ?? './examples/' + toUrlFriendlyString(name) + '/preview.webp'
        })`}
      />
      <Content class="mdc-typography--body2">
        <h4 class="mdc-typography--headline6" style="margin: 0;">
          {name}
        </h4>
      </Content>
    </PrimaryAction>
  </Card>
</div>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
  <Title id="simple-title">Do you want to open this example - {name}?</Title>
  <DialogContent id="simple-content">You will loose your current config.</DialogContent>
  <Actions>
    <Button>
      <Icon class="material-icons">close</Icon><Label>No</Label>
    </Button>
    <Button on:click={load}>
      <Icon class="material-icons">check</Icon><Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .wrapper {
    margin: 16px;
    border: 1px solid var(--border);
    border-radius: 4px;
  }
</style>
