<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { fetchLogin } from '$lib';

	let username = $state('');
	let password = $state('');

	async function login() {
		let request = await fetchLogin(username, password);
		let response = await request.json();

		if (response.status == 200) {
			invalidateAll();
		}
	}
</script>

<div class="root halign valign">
	<div class="content flexcolumn padding3 radius-heavy halign valign shadow-light">
		<div class="login hexpand flexcolumn gap4 halign valign padding2">
			<div class="login hexpand flexcolumn gap3 halign valign padding2">
				<div class="hexpand flexcolumn gap2">
					<p class="secondary">Username</p>
					<input type="text" name="" id="" class="shadow-light" bind:value={username} />
				</div>
				<div class="hexpand flexcolumn gap2">
					<p class="secondary">Password</p>
					<input type="password" name="" id="" class="shadow-light" bind:value={password} />
				</div>
			</div>

			<button
				onclick={() => {
					login();
				}}>Login</button
			>
		</div>
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}
	.root {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
		padding: 1rem;
	}

	.content {
		background-color: var(--secondary-color);
		max-width: 24rem;
		min-width: 16rem;
		width: 80%;
		padding: 2rem;
		transition: width 0.3s ease-out;
	}

	.login {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.hexpand {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	input {
		width: 100%;
		padding: 0.5rem;
	}

	button {
		width: 50%;
		padding: 0.75rem;
		background-color: var(--primary-color);
		color: white;
		border: none;
		cursor: pointer;
	}
</style>
