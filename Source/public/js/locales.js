$(() => {
  function changeLocale(locale) {
    $.get(`/locale-${locale}`, () => {
      window.location.reload();
    }).fail(() => {
      // TODO: How do we want to handle this error?
    });
  }

  $('#locale-en').click(() => {
    changeLocale('en');
  });

  $('#locale-nl').click(() => {
    changeLocale('nl');
  });
});
