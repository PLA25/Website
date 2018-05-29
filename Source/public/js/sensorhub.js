$(document).ready(() => {
  $('#table-temp').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [2],
    }],
  });
  $('#table-light').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [2],
    }],
  });
  $('#table-gass').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [2],
    }],
  });
});
