<script lang="ts">
	import NewsRow from './../lib/components/newsRow.svelte';
	import { getElement, requestFeed } from '$lib';
	import { rssFeeds } from '$lib/feeds.svelte';
	import Loader from '$lib/loader.svelte';

	let {
		data
	}: {
		data: {
			feeds: any;
			user: any;
			feedsData: {
				last_check: number;
				feed_url: string;
			}[];
		};
	} = $props();

	function getUnreadItems(rss: any, feed_id: string) {
		let elements = rss.getElementsByTagName('item');
		let unread = [];
		for (let item of elements) {
			let guid = getElement(item, 'guid');
			if (!rssFeeds.isRead(feed_id, guid)) {
				unread.push(item);
			}
		}
		return unread;
	}

	let expand: string[] = $state([]);
</script>

<div class="content">
	<div class="wrapper flexcolumn">
		<div class="padding4">
			<h1 class="title">Welcome {data.user.name}!</h1>
			{#if Object.values(rssFeeds.getFeeds()).length > 0}
				<h3>You have unread feeds from:</h3>
			{:else}
				<h3>You have no feeds!</h3>
			{/if}
		</div>
		<div class="feeds flexcolumn gap4 padding3">
			{#each rssFeeds.getFeeds() as feed (feed.feed_id)}
				{#await requestFeed(feed.feed_url, feed.feed_id)}
					<div class="flexrow hstartalign card shadow">
						<p class="secondary">{feed.title} -</p>
						<div style="scale: 50%; transform: translateY(2px);">
							<Loader></Loader>
						</div>
					</div>
				{:then rss}
					{#if getUnreadItems(rss, feed.feed_id).length > 0}
						<div class="flexcolumn gap3">
							<div
								class="card space-between flexrow shadow"
								class:open={expand.find((e) => e === feed.feed_id)}
								onclick={() => {
									if (expand.find((e) => e === feed.feed_id)) {
										expand = expand.filter((e) => e !== feed.feed_id);
									} else {
										expand = [...expand, feed.feed_id];
									}
								}}
							>
								<p>
									<span class="secondary">{feed.title}</span> -
									<span class="tertiary">{getUnreadItems(rss, feed.feed_id).length}</span>
								</p>
								{#if expand.find((e) => e === feed.feed_id)}
									<p class="tertiary">Click to hide</p>
								{:else}
									<p class="tertiary">Click to expand</p>
								{/if}
							</div>
							{#if expand.find((e) => e === feed.feed_id)}
								<div class="items flexcolumn gap1 radius-heavy">
									{#each getUnreadItems(rss, feed.feed_id) as item, u}
										<NewsRow
											{data}
											{item}
											feed_id={feed.feed_id}
											news_id={u + 1}
											guid={getElement(item, 'guid')}
										></NewsRow>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				{/await}
			{/each}
		</div>
	</div>
</div>

<style>
	.open * {
		color: var(--font-primary-color) !important;
	}
	.open {
		background-color: var(--accent-color-secondary);
	}
	.card {
		cursor: pointer;
	}
	.card:hover * {
		color: var(--font-primary-color) !important;
	}
	h3 {
		font-weight: 500;
	}
	.content {
		display: flex;
		flex-direction: column;
		width: 100% !important;
		max-height: 100vh;
		overflow: hidden !important;
	}
	.wrapper {
		flex: 1;
		overflow: scroll !important;
	}
	.items {
		width: 100% !important;
		overflow-y: auto;
	}
</style>
