<script lang="ts">
	let { rssContent, number } = $props();
</script>

{#if rssContent}
	<div class="content" style="height: calc(100vh / {number} - 6vh);">
		<div class="wrapper card">
			{rssContent}
		</div>
	</div>
{/if}

<style>
	.content {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.wrapper {
		word-break: break-word;
		flex: 1;
		overflow-y: auto;
	}
</style>
