import { env } from '$env/dynamic/private';
import { validateSession } from '$lib';
import { user } from '$lib/user.svelte.js';

export const load = async ({ cookies, fetch }) => {
    const backendUrl = env.BACKEND || '';
    const userData = await validateSession(backendUrl, cookies);
    let feedsData: {
        read: any; feeds: any[] 
} = {
    feeds: [],
    read: undefined
};

    if (userData.valid) {
        user.setLogged(true);
        user.setName(userData.username);
    
        feedsData = await getFeeds(fetch);
        return {
            backend: {
                url: backendUrl,
                validated: userData.valid
            },
            user: {
                name: userData.username,
                id: userData.uuid  // Add user ID here
            },
            feeds: {
                list: feedsData.feeds,
                read: feedsData.read
            }
        };
    }
    

    return {
        backend: {
            url: backendUrl,
            validated: userData.valid
        }
    };
};

async function getFeeds(fetch: any) {
    try {
        const response = await fetch("/feeds/get");
        return await response.json();
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
