<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { fetchLogin, fetchRegister, getFeeds } from '$lib';
	import { rssFeeds } from '$lib/feeds.svelte';
	import { user } from '$lib/user.svelte';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let showPsswd = $state(false);
	let error = $state('');

	async function register() {
		let request = await fetchRegister(username, email, password);
		let response = await request.json();

		if (response.status == 200) {
			fetchLogin(username, password);

			if (response.status == 200) {
				invalidateAll();
			}
		} else if (response.status == 409) {
			error = response.response;
		}
	}
</script>

<div class="root halign valign">
	<div class="content flexcolumn padding4 radius-heavy halign valign gap4 shadow-light">
		<div class="flexcolumn gap2 halign hexpand">
			<h2>Welcome!</h2>
			<h4>Create a default user</h4>
		</div>
		<div class="flexcolumn gap4 hexpand">
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<div class="flexcolumn gap3 hexpand">
				<div class="flexcolumn gap2 valign hstartalign hexpand">
					<label for="username" class="hexpand">Username:</label>
					<input
						type="text"
						name="username"
						id="username"
						class="hexpand shadow-light"
						bind:value={username}
					/>
				</div>
				<div class="flexcolumn gap2 valign hstartalign hexpand">
					<label for="email" class="hexpand">Email:</label>
					<input
						type="text"
						name="email"
						id="email"
						class="hexpand shadow-light"
						bind:value={email}
					/>
				</div>
				<div class="flexcolumn gap2 valign hstartalign hexpand">
					<label for="password" class="hexpand">Password:</label>
					<div class="flexrow valign hexpand gap2">
						<input
							type={showPsswd ? 'text' : 'password'}
							name="password"
							id="password"
							class="hexpand shadow-light"
							bind:value={password}
						/>
						<button
							class="transparent showPsswd valign"
							onclick={() => {
								showPsswd = !showPsswd;
							}}
						>
							{#if showPsswd}<svg
									class="icon"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
										stroke="var(--font-primary-color)"
										stroke-width="2"
									/>
								</svg>
							{:else}
								<svg
									class="icon"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
										stroke="var(--font-primary-color)"
										stroke-width="2"
									/>
									<path
										d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
										stroke="var(--font-primary-color)"
										stroke-width="2"
									/>
								</svg>
							{/if}
						</button>
					</div>
				</div>
				{#if error}
					<p class="error radius-medium">{error}</p>
				{/if}
			</div>
			<button
				class="hexpand shadow-light"
				onclick={() => {
					register();
				}}>Register</button
			>
		</div>
	</div>
</div>

<style>
	.showPsswd {
		width: min-content !important;
	}
	* {
		box-sizing: border-box;
	}
	button {
		width: 50%;
		padding: 0.75rem;
		background-color: var(--primary-color);
		color: white;
		border: none;
		cursor: pointer;
	}
	.content {
		background-color: var(--secondary-color);
		max-width: 24rem;
		min-width: 16rem;
		width: 80%;
		padding: 2rem;
		transition: width 0.3s ease-out;
	}
	.halign {
		text-align: center;
	}
	.hstartalign {
		text-align: start;
	}
	input {
		width: 100%;
		padding: 0.5rem;
	}
</style>
