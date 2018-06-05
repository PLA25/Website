$(document).ready(() => {
  const knop = $('button.btn.btn-primary');

  knop.on('click', () => {
    window.location.href = '/account/edit';
  });
});
