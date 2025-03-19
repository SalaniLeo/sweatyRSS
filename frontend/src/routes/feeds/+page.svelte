<script lang="ts">
	import { goto } from '$app/navigation';
	import { getElement, requestFeed } from '$lib';
	import NewsRow from '$lib/components/newsRow.svelte';
	import { rssFeeds } from '$lib/feeds.svelte';
	import Loader from '$lib/loader.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	function getItemsFromFeed(id: number) {
		let feed = rssFeeds.getFeedContent(id).content;
		return feed.getElementsByTagName('item');
	}

	console.log(data);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if data.id && rssFeeds.getFeeds()}
	{#await requestFeed(rssFeeds.getFeed(data.id).feed_url, data.id)}
		<Loader></Loader>
	{:then rss}
		<div class="content">
			<div class="wrapper flexcolumn gap4">
				{#if data.id}
					<div>
						<h1 class="title">
							{getElement(rss, 'title')}
						</h1>
						<p>
							Last updated: <span class="secondary"
								>{getElement(rss, 'lastBuildDate')}, {Object.values(getItemsFromFeed(data.id))
									.length} total</span
							>
						</p>
					</div>
					<div class="items flexcolumn gap1 radius-heavy">
						{#each getItemsFromFeed(data.id) as item, i}
							{#if i < 365}
								<NewsRow {data} {item} feed_id={data.id} news_id={i} guid={getElement(item, 'guid')}
								></NewsRow>
							{/if}
						{/each}
					</div>
				{:else}
					<p>You need to specify an id!</p>
				{/if}
			</div>
		</div>
	{/await}
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_consider_explicit_label -->
{#if data.id && data.item}
	<div class="top" onclick={() => goto(`/feeds?id=${data.id}`)}>
		<div class="padding6">
			<div class="wrapper radius-heavy flexcolumn gap4">
				<div class="flexrow space-between">
					<div class="flexcolumn gap2">
						<h1 class="title">
							{getElement(getItemsFromFeed(data.id)[data.item], 'title')}
						</h1>
						<a href={getElement(getItemsFromFeed(data.id)[data.item], 'guid')}
							>Open article &#8599;
						</a>
					</div>
					<button class="close transparent valign" onclick={() => goto(`/feeds?id=${data.id}`)}>
						<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_iconCarrier">
								<g id="Menu / Close_MD">
									<path
										id="Vector"
										d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
										stroke="var(--font-primary-color)"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
								</g>
							</g></svg
						>
					</button>
				</div>
				<div>
					{@html getElement(getItemsFromFeed(data.id)[data.item], 'description')}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.top {
		width: 100vw;
		height: 100vh !important;
		background-color: var(--background-blurry);
		backdrop-filter: blur(5px);
		position: fixed;
		z-index: 3;
	}
	.top .wrapper {
		background-color: var(--primary-color);
		height: calc(100vh - 9rem);
		overflow-y: scroll !important;
	}
	:global(img) {
		max-width: 100% !important;
		max-height: 1080px !important;
	}
	.content {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		width: 100% !important;
	}
	.wrapper {
		max-height: calc(100vh - 2rem);
		padding: 1rem;
	}
	.items {
		width: 100% !important;
		height: 100%;
		overflow-y: scroll !important;
	}
</style>
