<script lang="ts">
	import { app } from './app.svelte';

	let { data } = $props();

	let keepOpen = false;

	$effect(() => {
		if (app.doShow()) {
			setTimeout(() => {
				if (!keepOpen) {
					app.hideToast();
				}
			}, 5000);
		}
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="toast margin3 radius-medium"
	class:show={app.doShow()}
	class:ok={app.getCode() === 200}
	class:alert={app.getCode() === 300}
	class:error={app.getCode() === 400}
	onmouseleave={() => {
		app.hideToast();
		keepOpen = false;
	}}
	onmouseenter={() => {
		keepOpen = true;
	}}
>
	<div class="padding3 valign halign">
		{app.getMessage()}
	</div>
</div>

<style>
	.show {
		transform: translateX(0) !important;
	}
	.toast {
		transform: translateX(calc(100% + 3rem));
		position: fixed;
		/* width: fit-content; */
		/* height: 100px; */
		right: 0px;
		top: 0px;
		z-index: 10;
	}
</style>
