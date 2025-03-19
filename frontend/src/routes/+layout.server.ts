import { env } from '$env/dynamic/private';
import { getFeeds, validateSession } from '$lib';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, fetch, url }) => {
    const backendUrl = env.BACKEND || '';
    const userData = await validateSession(backendUrl, cookies);
    let feedsData = { feeds: [], read: undefined };

    // Allow access to login and register pages without authentication
    if (!userData.valid && !['/auth/login', '/auth/register'].includes(url.pathname)) {
        throw redirect(302, '/auth/login');
    }

    if (userData.valid) {
        feedsData = await getFeeds(fetch);
        return {
            backend: {
                url: backendUrl,
                validated: userData.valid
            },
            user: {
                name: userData.username,
                id: userData.uuid
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