<script>
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Paper from '@smui/paper';
  import KofiButton from '../ko-fi-button/ko-fi-button.svelte';

  export let open = false;
</script>

<Dialog bind:open aria-labelledby="about-title" aria-describedby="about-content">
  <Title id="about-title">About</Title>
  <Content id="about-content">
    <Paper class="about-content" elevation={0}>
      <h2>Three Particles Editor</h2>
      <p>
        A visual configuration tool for the <a
          href="https://www.npmjs.com/package/@newkrok/three-particles"
          target="_blank"
          rel="noopener noreferrer">@newkrok/three-particles</a
        > system.
      </p>

      <p>
        This open-source project supports loading both legacy 1.x.x configurations and the latest
        2.x.x format. Exporting is currently available only in the 2.x.x format.
      </p>
      <div class="about-details">
        <p><strong>Version:</strong> __APP_VERSION__</p>
        <p><strong>Build Date:</strong> __BUILD_DATE__</p>
        <p><strong>License:</strong> MIT License</p>
        <p>
          <strong>Author:</strong>
          <a href="https://github.com/NewKrok" target="_blank" rel="noopener noreferrer">NewKrok</a>
        </p>
      </div>

      <div class="about-links">
        <p>
          <strong>Source code and documentation:</strong><br />
          <a
            href="https://github.com/NewKrok/three-particles-editor"
            target="_blank"
            rel="noopener noreferrer">https://github.com/NewKrok/three-particles-editor</a
          >
        </p>

        <p>
          <strong>Have feedback or found a bug?</strong><br />
          <a
            href="https://github.com/NewKrok/three-particles-editor/issues"
            target="_blank"
            rel="noopener noreferrer">Open an issue on GitHub</a
          >
        </p>
      </div>

      <div class="support-section">
        <h3>Support This Project</h3>
        <p>
          If you find this editor useful, consider supporting its development! Your support helps
          maintain and improve this tool for the community.
        </p>
        <KofiButton fullWidth={true} utmCampaign="about_modal" />
      </div>
    </Paper>
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  :global(.about-content) {
    padding: 0 16px;
    max-width: 500px;

    h2 {
      color: #ff3e00;
      margin-top: 0;
    }

    p {
      line-height: 1.5;
    }

    .about-details {
      margin: 20px 0;

      p {
        margin: 8px 0;
      }
    }

    .about-links {
      margin-top: 20px;

      a {
        color: #ff3e00;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .support-section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      h3 {
        color: #ff3e00;
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 16px;
      }

      p {
        margin-bottom: 12px;
        font-size: 14px;
      }
    }
  }
</style>
