<script>
  import Button, { Label, Icon } from '@smui/button';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Paper from '@smui/paper';

  let lightTheme =
    typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;

  const switchTheme = () => {
    lightTheme = !lightTheme;
    let themeLink = document.head.querySelector('#theme');
    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.rel = 'stylesheet';
      themeLink.id = 'theme';
    }
    themeLink.href = `./build/static/smui${lightTheme ? '' : '-dark'}.css`;
    document.head
      .querySelector('link[href="./build/static/smui-dark.css"]')
      ?.insertAdjacentElement('afterend', themeLink);
  };

  let open = false;
  let aboutModalOpen = false;
  let mobileMenuOpen = false;

  const createNewRequest = () => (open = true);
  const createNew = () => window.editor.createNew();

  // Function to check if we're on a mobile device
  const checkMobile = () => {
    isMobile = window.innerWidth < 768;
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  // Detect if we're on a mobile device
  let isMobile = false;

  if (typeof window !== 'undefined') {
    // Check on load
    checkMobile();

    // Update on resize
    window.addEventListener('resize', checkMobile);
  }
</script>

<div class="wrapper">
  <div class="left-section">
    <button
      class="logo-button"
      on:click={() => (aboutModalOpen = true)}
      on:keydown={(e) => e.key === 'Enter' && (aboutModalOpen = true)}
      title="About Three Particles Editor"
      aria-label="About Three Particles Editor"
    >
      <img src="./assets/images/logo-colorful.png" alt="Three Particles Logo" class="logo" />
    </button>
  </div>

  {#if !isMobile}
    <!-- Desktop layout -->
    <div class="center-section">
      <Button on:click={createNewRequest} variant="raised">
        <Icon class="material-icons">note_add</Icon><Label>New</Label>
      </Button>
      <Button on:click={window.editor.copyToClipboard} variant="raised">
        <Icon class="material-icons">file_copy</Icon><Label>Copy</Label>
      </Button>
      <Button on:click={window.editor.loadFromClipboard} variant="raised">
        <Icon class="material-icons">content_paste</Icon><Label>Paste</Label>
      </Button>
    </div>
    <div class="right-section">
      <Button on:click={switchTheme} variant="raised">
        <Icon class="material-icons">{lightTheme ? 'dark_mode' : 'light_mode'}</Icon>
        <Label>{lightTheme ? 'Dark mode' : 'Light mode'}</Label>
      </Button>
    </div>
  {:else}
    <!-- Mobile layout -->
    <div class="mobile-controls">
      <!-- Theme toggle button -->
      <button class="icon-button" on:click={switchTheme}>
        <span class="material-icons">{lightTheme ? 'dark_mode' : 'light_mode'}</span>
      </button>

      <!-- Menu button -->
      <button class="icon-button" on:click={toggleMobileMenu}>
        <span class="material-icons">menu</span>
      </button>

      <!-- Mobile dropdown menu -->
      {#if mobileMenuOpen}
        <div class="mobile-menu" class:dark-theme={!lightTheme}>
          <button
            class="menu-item"
            on:click={() => {
              createNewRequest();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">note_add</span>
            <span>New</span>
          </button>
          <button
            class="menu-item"
            on:click={() => {
              window.editor.copyToClipboard();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">file_copy</span>
            <span>Copy</span>
          </button>
          <button
            class="menu-item"
            on:click={() => {
              window.editor.loadFromClipboard();
              mobileMenuOpen = false;
            }}
          >
            <span class="material-icons">content_paste</span>
            <span>Paste</span>
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
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

<Dialog bind:open={aboutModalOpen} aria-labelledby="about-title" aria-describedby="about-content">
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
        <p><strong>Version:</strong> 2.0.0</p>
        <p><strong>Build Date:</strong> April 17, 2025</p>
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
    </Paper>
  </Content>
  <Actions>
    <Button on:click={() => (aboutModalOpen = false)}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .wrapper {
    width: 100%;
    background: var(--mdc-theme-background);
    display: flex;
    padding: 5px 10px;
    border-bottom: 1px solid var(--border);
    justify-content: space-between;
    align-items: center;
  }

  .left-section {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .center-section {
    display: flex;
    gap: 8px;
    flex-grow: 0;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .right-section {
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    position: relative;
  }

  .icon-button {
    border: none;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #ff3e00;
    box-shadow:
      0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }

  .icon-button:hover {
    opacity: 0.9;
  }

  .icon-button .material-icons {
    color: white;
  }

  .mobile-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 100;
    margin-top: 4px;
    min-width: 180px;
    overflow: hidden;

    &.dark-theme {
      background-color: #222;
      border-color: #333;
      color: white;

      .menu-item {
        color: #fff;

        &:hover {
          background-color: #333;
        }
      }
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    width: 100%;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    color: #333;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .logo-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .logo {
    height: 36px;
    vertical-align: middle;
  }

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
  }
</style>
