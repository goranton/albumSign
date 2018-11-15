export default async function ({ store, params, redirect }) {
  try {
    await store.dispatch('workplace/getWorkplace', params.code);
  } catch (e) {
    // redirect back
    redirect('/');
  }
}
