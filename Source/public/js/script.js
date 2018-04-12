$('#locale-en').click(function() {
  $.post('/locale-en');

  setTimeout(location.reload.bind(location), 100);
});

$('#locale-nl').click(function() {
  $.post('/locale-nl');

  setTimeout(location.reload.bind(location), 100);
});