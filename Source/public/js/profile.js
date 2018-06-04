$(window).on('load', () => {
  const knop = $('button.btn.btn-warning');

  knop.on('click', () => {
    window.location.href = '/account/edit';
  });
});
