export function load({ url }) {
    const id = url.searchParams.get('id');
    const item = url.searchParams.get('item');
    return { id, item };
}
