import { env } from '$env/dynamic/private';
import { validateSession } from '$lib';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies, fetch }) {
    const backendUrl = env.BACKEND || '';

    if (cookies.get('session')) {
        const userData = await validateSession(backendUrl, cookies);
        if(userData.valid) {
            redirect(301, '/')
        }
    }
}