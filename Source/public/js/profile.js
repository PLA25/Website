$(document).ready(() => {
  const knop = $('button#edit-button');

  knop.on('click', () => {
    window.location.href = '/account/edit';
  });
});
