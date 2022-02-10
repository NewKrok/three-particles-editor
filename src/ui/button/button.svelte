<script>
    import Fa from 'svelte-fa'

	export let label = '';
	export let icon = null;
</script>

<div class="wrapper">{#if icon}<Fa icon={icon} />{" "}{/if}{label}</div>

<style>
	.wrapper {
        cursor: pointer;
        color: #fff;
        font-size: 12px;
        text-align: center;
        padding: 5px;
        background: #424242;
        border-radius: 3px;
        width: auto;
    }

    .wrapper:hover {
        background: #4f4f4f;
        user-select: none;
    }
</style>