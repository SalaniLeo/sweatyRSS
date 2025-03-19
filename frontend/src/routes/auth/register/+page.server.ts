import { doCreateUser } from '$lib';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch }) {
    const doCreate = await doCreateUser(fetch);
    
    if (!doCreate.response) {
        throw redirect(302, '/auth/login');
    }

    return {};
}