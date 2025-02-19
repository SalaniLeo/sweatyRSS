<script lang="ts">
	import { addFeed, deleteFeed, fetchFeeds } from '$lib';
	import { app } from '$lib/app.svelte';
	import VerifyPassword from '$lib/components/verifyPassword.svelte';
	import { rssFeeds } from '$lib/feeds.svelte';

	let {
		data
	}: {
		data: {
			feeds: any;
			backend: any;
			user: any;
		};
	} = $props();

	let feed = $state('');
	let response = $state({ status: null, message: '' });

	async function Add() {
		if (feed) {
		} else {
			return;
		}

		let feedContent = await fetchFeeds(feed);
		let title = feedContent.getElementsByTagName('title')[0].textContent || 'Untitled';

		let request = await addFeed(feed, title, Date.now());
		let response = await request.json();
		if (response.status === 201) {
			rssFeeds.addFeed({
				created_at: new Date().toUTCString(),
				feed_url: feed,
				id: response.id,
				last_check: new Date().toUTCString(),
				title: title,
				user_id: data.user.id
			});
			feed = '';
			app.setStatus(response.message, 200);
		} else {
			app.setStatus(response.message, 400);
		}
	}

	async function Delete(id: number) {
		let request = await deleteFeed(id);
		let response = await request.json();

		if (response.status === 200) {
			rssFeeds.setFeeds(data.feeds.list.filter((feed: { id: number }) => feed.id !== id));
			app.setStatus(response.message, 200);
		} else {
			app.setStatus(response.message, 400);
		}
	}

	let showpasswordfield = $state(false);
	let password = $state('');
	let showpassword = $state(false);
</script>

<div class="content hexpand vexpand">
	<div class="wrapper flexcolumn">
		<h1 class="padding3">Settings</h1>
		{#if data.backend.validated}
			<div class="settingscontent flexcolumn">
				<div class="account flexcolumn gap2 padding3">
					<h2>Account</h2>
					<div class="flexcolumn gap1">
						<div
							class="card flexrow valign gap4 space-between noradius topradius-heavy shadow-light"
						>
							<div class="flexrow valign gap2">
								<svg
									class="icon"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
										stroke="var(--font-primary-color)"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<p>Username</p>
							</div>
							<p class="secondary">{data.user.name}</p>
						</div>
						<div
							class="card flexrow valign gap4 space-between noradius bottomradius-heavy passwordcard shadow-light"
						>
							<div class="flexrow valign gap2">
								<svg
									class="icon"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
										stroke="var(--font-primary-color)"
										stroke-width="1.5"
									/>
									<path
										d="M12.0002 10V14M10.2678 11L13.7319 13M13.7317 11L10.2676 13"
										stroke="var(--font-primary-color)"
										stroke-width="1.5"
										stroke-linecap="round"
									/>
								</svg>
								<p class="secondary">Password</p>
							</div>
							<div>
								{#if showpassword}
									<div class="flexrow gap2 valign">
										<p class="secondary valign halign">{password}</p>
										<!-- svelte-ignore a11y_consider_explicit_label -->
										<button class="transparent valign" onclick={() => (showpassword = false)}>
											<svg
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
										</button>
									</div>
								{:else}
									<div class="flexrow gap2 valign">
										<p class="secondary valign halign">********</p>
										<!-- svelte-ignore a11y_consider_explicit_label -->
										<button class="transparent valign" onclick={() => (showpasswordfield = true)}>
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
										</button>
									</div>
								{/if}
								{#if showpasswordfield}
									<VerifyPassword
										bind:password
										username={data.user.name}
										bind:show={showpasswordfield}
										bind:valid={showpassword}
									></VerifyPassword>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="feeds flexcolumn gap2 padding3">
					<h2>Feeds - {Object.values(rssFeeds.getFeeds()).length}</h2>
					<div class="flexcolumn gap4">
						<div class="flexcolumn gap1">
							<div class="flexrow space-between valign">
								<p>Add feed</p>
								{#if response}
									<small
										class:errorfont={response.status === 409}
										class:okfont={response.status === 200 || response.status === 201}
									>
										{response.message}
									</small>
								{/if}
							</div>
							<div class="card flexrow valign gap4 space-between newcard shadow-light">
								<input type="text" style="width: 100%;" placeholder="url" bind:value={feed} />
								<!-- svelte-ignore a11y_consider_explicit_label -->
								<button class="transparent valign" onclick={() => Add()}>
									<svg
										class="icon"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
											fill="var(--font-primary-color)"
										/>
									</svg>
								</button>
							</div>
						</div>
						<div class="gap1 flexcolumn">
							{#each Object.values(rssFeeds.getFeeds()) as feed (feed.id)}
								<div
									class="noradius card flexrow valign gap4 space-between shadow-light"
									class:topradius-heavy={feed === Object.values(rssFeeds.getFeeds())[0]}
									class:bottomradius-heavy={feed ===
										Object.values(rssFeeds.getFeeds())[
											Object.values(rssFeeds.getFeeds()).length - 1
										]}
								>
									<div class="flexcolumn gap1">
										<a href={feed.feed_url}>{feed.title} &#8599 </a>
									</div>
									<!-- svelte-ignore a11y_consider_explicit_label -->
									<button class="transparent valign" onclick={() => Delete(feed.feed_url)}>
										<svg
											class="icon"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M10 12V17" stroke="var(--font-error-color)" stroke-width="2" />
											<path d="M14 12V17" stroke="var(--font-error-color)" stroke-width="2" />
											<path d="M4 7H20" stroke="var(--font-error-color)" stroke-width="2" />
											<path
												d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
												stroke="var(--font-error-color)"
												stroke-width="2"
											/>
											<path
												d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
												stroke="var(--font-error-color)"
												stroke-width="2"
											/>
										</svg>
									</button>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- <div class="email">
					<h2>Email notifications</h2>
				</div> -->
			</div>
		{:else}
			<div class="card">
				<h3>You are not logged in!</h3>
			</div>
		{/if}
	</div>
</div>

<style>
	.card {
		width: 350px;
	}
	.newcard {
		border-top-left-radius: 0;
	}
	.settingscontent {
		overflow: scroll;
	}
</style>
