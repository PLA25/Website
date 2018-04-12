function changeLocale(locale) {
  $.post('/locale-' + locale);

  setTimeout(location.reload.bind(location), 100);
}

$('#locale-en').click(function() {
  changeLocale('en');
});

$('#locale-nl').click(function() {
  changeLocale('nl');
});