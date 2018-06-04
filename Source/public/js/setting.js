$(document).ready(() => {
  $('#table-setting').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [2, 3],
    }],
  });
});
