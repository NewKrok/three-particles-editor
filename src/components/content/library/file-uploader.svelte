<script>
  import Button, { Label, Icon } from '@smui/button';

  export let add;

  let fileinput;

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    toBase64(image).then(add);
  };
</script>

<div class="add-image">
  <Button
    color="secondary"
    on:click={() => {
      fileinput.click();
    }}
    variant="outlined"
  >
    <Icon class="material-icons">image_search</Icon><Label>Add Image</Label>
  </Button>
</div>
<input
  style="display:none"
  type="file"
  accept=".jpg, .jpeg, .png, .webp"
  on:change={(e) => onFileSelected(e)}
  bind:this={fileinput}
/>

<style lang="scss">
  .add-image {
    width: 100%;
    padding: 0 16px;
  }

  * :global(.mdc-button) {
    width: 100%;
  }
</style>
