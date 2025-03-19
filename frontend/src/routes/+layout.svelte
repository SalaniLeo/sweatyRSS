<script lang="ts">
	import GlobalToast from './../lib/globalToast.svelte';
	import { page } from '$app/stores';
	import Sidebar from './../lib/components/sidebar.svelte';
	import { user } from '$lib/user.svelte';
	import { rssFeeds } from '$lib/feeds.svelte';
	import Loader from '$lib/loader.svelte';
	import { goto } from '$app/navigation';
	import { doCreateUser } from '$lib';

	let { children, data } = $props();
	let initialized = $state(false);

	$effect(() => {
		if (data.backend.validated) {
			user.setLogged(true);
			user.setName(data.user?.name ?? '');
			rssFeeds.setFeeds(data.feeds?.list ?? []);
			rssFeeds.setReadFeed(data.feeds?.read ?? []);
		} else if (
			!data.backend.validated &&
			$page.url.pathname != '/auth/login' &&
			$page.url.pathname != '/auth/register'
		) {
			redirect();
		}
		initialized = true;
	});

	async function redirect() {
		let doCreate = await doCreateUser(fetch);
		console.log(doCreate);
		if (doCreate.response === true) {
			goto('/auth/register');
		} else {
			goto('/auth/login');
		}
	}
</script>

{#if initialized}
	{#if user.getLogged()}
		<div class="root flexrow">
			<Sidebar></Sidebar>
			{@render children()}
		</div>

		<GlobalToast {data}></GlobalToast>
	{:else}
		{@render children()}
	{/if}
{:else}
	<div class="fullheight">
		<Loader></Loader>
	</div>
{/if}
