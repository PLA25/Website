$(document).ready(() => {
  $('#table-sensorhubs').DataTable({
    columnDefs: [{
      orderable: false,
      searchable: false,
      targets: [1, 2],
    }],
  });
});
