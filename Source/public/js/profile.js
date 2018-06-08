$(document).ready(() => {
  const knop = $('#edit-button');

  knop.on('click', () => {
    window.location.href = '/account/edit';
  });
});
