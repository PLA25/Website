function changeLocale(locale) {
  $.post(`/locale-${locale}`);

  setTimeout(location.reload.bind(location), 100);
}

$('#locale-en').click(() => {
  changeLocale('en');
});

$('#locale-nl').click(() => {
  changeLocale('nl');
});
