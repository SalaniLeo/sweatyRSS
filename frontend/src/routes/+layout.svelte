<script lang="ts">
	import GlobalToast from './../lib/globalToast.svelte';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import Sidebar from './../lib/components/sidebar.svelte';
	import { user } from '$lib/user.svelte';
	import { rssFeeds } from '$lib/feeds.svelte';

	let { children, data } = $props();

	if (data.backend.validated) {
		user.setLogged(true);
		user.setName(data.user?.name ?? '');
	} else if (!data.backend.validated && $page.url.pathname != '/auth/login') {
		throw redirect(308, '/auth/login');
	}
	rssFeeds.setFeeds(data.feeds?.list ?? []);
	rssFeeds.setReadFeed(data.feeds?.read);
</script>

<div class="root flexrow">
	{#if user.getLogged()}
		<Sidebar {data}></Sidebar>
	{/if}
	{@render children()}
</div>

<GlobalToast {data}></GlobalToast>
