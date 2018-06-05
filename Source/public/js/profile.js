$(document).ready(() => {
  const knop = $('button.btn#edit-button');

  knop.on('click', () => {
    window.location.href = '/account/edit';
  });
});
