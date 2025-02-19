import { app } from "./app.svelte";
import { rssFeeds } from "./feeds.svelte";
import GlobalToast from "./globalToast.svelte";

export function getElement(item: any, element: string) {
    try {
        return item.getElementsByTagName(element)[0].childNodes[0].nodeValue;
    } catch (error) {
        return "Data not available";
    }
}

export async function validateSession(backendUrl: string, cookies: { get: (arg0: string) => any; }) {
    try {
        const response = await fetch(`${backendUrl}/api/validate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cookies.get('session')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return { valid: false };
        }

        return await response.json();
    } catch (error) {
        return { error };
    }
}

export async function read_element(feed_id: number, guid: number) {
    try {
        const response = await fetch(`/feeds/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                feed_id: feed_id,
                guid: guid
            })
        });

        return await response.json();
    } catch (error) {
        return { error };
    }
}

export async function fetchFeeds(feed_url: string) {
    let request = await fetch('/feeds/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            feed_url: feed_url
        })
    });

    let response = await request.text();
    if (window.DOMParser) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, 'text/xml');
        return xmlDoc;
    } else {
        throw new Error("DOMParser is not supported in this environment.");
    }
}

export async function fetchLogin(username: string, password: string) {
    return await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
    })});
}

export async function verifyPassword(username: string, password: string) {
    return await fetch('/auth/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
    })});
}


export async function addFeed(feed: string, title: any, last_opened: number) {
    return await fetch(`/feeds/add`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            feed_url: feed,
            title: title,
            last_opened: last_opened
        })
    });
}

export async function deleteFeed(feed: number) {
    return await fetch(`/feeds/delete`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            feed_url: feed
        })
    });
}

export async function requestFeed(url: string, id: string) {
    let feed = rssFeeds.getFeedContent(id);

    if (feed) {
        return feed.content;
    } else {
        let content = await fetchFeeds(url);
        rssFeeds.addFeedContent({
            content: content,
            id: id
        });
        return content;
    }
}

export async function get_read(feed_id: number) {
    return await fetch(`/feeds/getread`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            feed_id: feed_id,
        })
    });
}