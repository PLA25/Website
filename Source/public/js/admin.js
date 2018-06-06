$(document).ready(() => {
  $('#table-sensorhubs').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [3, 4, 5],
    }],
  });

  $('#table-users').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [2, 3],
    }],
  });

  $('#table-limitvalue').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [2, 3],
    }],
  });
});
