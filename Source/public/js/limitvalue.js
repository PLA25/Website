$(document).ready(() => {
  $('#table-limitvalue').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [2, 3],
    }],
  });
});
