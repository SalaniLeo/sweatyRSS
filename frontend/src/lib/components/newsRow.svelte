<script lang="ts">
	import { goto } from '$app/navigation';
	import { getElement, read_element } from '$lib';
	import { app } from '$lib/app.svelte';
	import { rssFeeds } from '$lib/feeds.svelte';

	let { item, feed_id, guid, news_id, data } = $props();

	let read = $derived(!rssFeeds.isRead(feed_id, guid));
	console.log(read);
	async function handleOpen() {
		if (read) {
			let response = await read_element(feed_id, guid);
			if (response.status === 500) {
				app.setStatus('Could not read news, ' + response.message, 400);
			} else if (response.status === 200) {
				rssFeeds.addReadFeed({
					feed_id: feed_id,
					guid: guid,
					user_id: data.user.id
				});
			}
		}
	}
</script>

<div class="content">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="noradius card flexcolumn gap2 shadow-light-center"
		class:read
		onclick={() => {
			handleOpen();
			goto(`/feeds?id=${feed_id}&item=${news_id}`);
		}}
	>
		<h3>
			{#if read}
				&#x2022
			{/if}

			{getElement(item, 'title')}
		</h3>
		<small class="secondary">{String(getElement(item, 'pubDate')).split('+')[0]}</small>
	</div>
</div>
