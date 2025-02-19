class Feeds {
    feeds: any[] = $state([]);
    read_feeds: any[] = $state([]);
    feed_content: any[] = $state([])

    constructor(array: []) {
        this.feeds = array;
    }

    addReadFeed(object: {}) {
        this.read_feeds = [...this.read_feeds, object];
    }

    setReadFeed(array: []) {
        this.read_feeds = array;
    }

    addFeed(feed: any) {
        this.feeds = [...this.feeds, feed];
    }

    setFeeds(array: any[]) {
        this.feeds = array;
    }

    addFeedContent(array: {content: any, id: string}) {
        this.feed_content = [array, ...this.feed_content];
    }

    getReadFeed() {
        return this.read_feeds;
    }

    getFeedContent(id: string) {
        return this.feed_content.find((feed) => feed.id === id);
    }

    getFeeds = () => {
        return this.feeds;
    }

    getFeed(id: string) {
        return this.feeds.find((feed) => feed.id === id);
    }

    isRead(feed_id: string, guid: number): boolean {
        return this.read_feeds.some((read_feed) => read_feed.feed_id === feed_id && read_feed.guid === guid);
    }

    reset() {
        this.feeds = [];
    }
}

export const rssFeeds = new Feeds([]);