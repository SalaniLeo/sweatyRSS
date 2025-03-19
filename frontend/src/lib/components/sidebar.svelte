<script lang="ts">
	import { goto } from '$app/navigation';
	import { rssFeeds } from '$lib/feeds.svelte';
	import { user } from '$lib/user.svelte';
	import ThemeChanger from '$lib/themeChanger.svelte';

	async function logout() {
		let request = await fetch('/auth/logout');
		let data = await request.json();

		if ((data.message = 'Logout succesful')) {
			user.reset();
			rssFeeds.reset();
			goto('/auth/login');
		}
	}
</script>

<div class="content flexcolumn shadow-light-center">
	<div class="wrapper padding3 gap5 flexcolumn">
		<div class="top flexrow valign gap4">
			<div class="flexcolumn">
				<h2>sweatyRSS</h2>
				<a href="https://salanileo.dev">by sudatoLeo</a>
			</div>
			<ThemeChanger></ThemeChanger>
		</div>
		<div class="flexcolumn space-between nav gap4">
			<div class="flexcolumn gap3">
				<div class="home">
					<a href="/"><h3>Home</h3></a>
				</div>
				<hr />
				<div class="feeds flexcolumn gap3">
					<h3>Feeds</h3>
					<div class="flexcolumn gap2">
						{#each rssFeeds.getFeeds() as feed, i}
							<a
								href="/feeds?id={feed.feed_id}"
								class="padding2 radius-medium"
								style="font-size: 0.9rem;"
							>
								{feed.title}
							</a>
						{:else}
							<p class="link">You have no feeds!</p>
						{/each}
					</div>
				</div>
			</div>
			<div class="bottom valign flexcolumn gap3">
				<button class="addFeed valign gap2 shadow-light" onclick={() => goto('/settings')}>
					<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier">
							<circle cx="12" cy="12" r="3" stroke="var(--font-primary-color)" stroke-width="1.5"
							></circle>
							<path
								d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
								stroke="var(--font-primary-color)"
								stroke-width="1.5"
							></path>
						</g></svg
					>
					Settings
				</button>
				<button class="login flexrow space-between shadow-light">
					<div class="valign gap2">
						<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_iconCarrier">
								<path
									d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
									stroke="var(--font-primary-color)"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</g></svg
						>
						{user.getName()}
					</div>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span
						class="transparent valign"
						onclick={() => {
							logout();
						}}
					>
						<svg
							class="icon"
							fill="var(--font-primary-color)"
							viewBox="0 0 32 32"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							transform="rotate(180)"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_iconCarrier">
								<title>login</title>
								<path
									d="M12.219 26.156h6.094c1.156 0 2.125-0.406 2.875-1.188 0.75-0.75 1.219-1.75 1.219-2.875v-12.219c0-1.125-0.469-2.125-1.219-2.875s-1.75-1.188-2.875-1.188h-6.094v2.563h6.094c0.875 0 1.531 0.656 1.531 1.5v12.219c0 0.844-0.656 1.531-1.531 1.531h-6.094v2.531zM0 13.563v4.875c0 0.563 0.469 1.031 1.031 1.031h5.688v3.844c0 0.344 0.156 0.625 0.469 0.781 0.125 0.031 0.281 0.031 0.344 0.031 0.219 0 0.406-0.063 0.563-0.219l7.344-7.344c0.281-0.281 0.25-0.844 0-1.156l-7.344-7.313c-0.25-0.25-0.563-0.281-0.906-0.188-0.313 0.156-0.469 0.406-0.469 0.75v3.875h-5.688c-0.563 0-1.031 0.469-1.031 1.031z"
								></path>
							</g></svg
						>
					</span>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.addFeed,
	.login {
		background-color: transparent;
		width: 100%;
		text-wrap: nowrap;
		outline: none;
	}
	.content {
		background-color: var(--secondary-color);
		border-right: 1px solid var(--accent-color-primary);
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-width: 250px;
	}
	.wrapper,
	.nav {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	hr {
		width: 100%;
		border: 1px solid var(--border-color);
		margin: 0;
	}
</style>
