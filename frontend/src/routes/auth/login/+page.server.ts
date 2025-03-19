import { env } from '$env/dynamic/private';
import { validateSession, doCreateUser } from '$lib';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies, fetch }) {
    const backendUrl = env.BACKEND || '';

    const doCreate = await doCreateUser(fetch);

    if (doCreate.response == true) {
        console.log(doCreate.response)
        throw redirect(302, '/auth/register');
    }


    if (cookies.get('session')) {
        const userData = await validateSession(backendUrl, cookies);
        if(userData.valid) {
            redirect(301, '/')
        }
    }

}