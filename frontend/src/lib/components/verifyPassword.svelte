<script lang="ts">
	import { verifyPassword } from '$lib';
	import { app } from '$lib/app.svelte';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	onMount(() => {
		document.title = 'sweatyRSS - Login';
	});
	let { username, show = $bindable(), valid = $bindable(), password = $bindable() } = $props();

	let response = $state({ message: '', error: '', status: 0 });

	async function login() {
		let request = await verifyPassword(username, password);
		response = await request.json();

		if (response.status === 200) {
			valid = true;
			show = false;
		} else {
			app.setStatus(response.message, 400);
		}
		return response;
	}
</script>

{#if show}
	<div class="content flexcolumn gap4">
		<div class="flexrow space-between">
			<h4>Veirfy</h4>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button class="transparent" onclick={() => (show = false)}>
				<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<path
							d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
							fill="var(--font-primary-color)"
						></path>
					</g></svg
				>
			</button>
		</div>
		<div class="flexcolumn gap4">
			<div class="flexcolumn gap1">
				<input type="password" placeholder="Password" bind:value={password} />
				{#if response.error}
					<small class="errorfont">{response.error}</small>
				{/if}
			</div>
			<button
				onclick={() => {
					if (password != '') {
						login();
					}
				}}>Verify</button
			>
		</div>
	</div>
{/if}

<style>
	small {
		margin: 0;
	}
	.icon {
		width: 1rem !important;
		height: 1rem !important;
	}
	.content {
		position: absolute;
		background-color: var(--accent-color-secondary);
		box-shadow: 0px 0px 5px 0px var(--shadow-color-medium);
		border-radius: var(--border-radius-heavy);
		padding: 1rem;
		height: min-content;
		width: 245px;
		top: 245px;
		transform: translate(-15px);
	}
</style>
