$(document).ready(() => {
  $('#table-sensorhubs').DataTable({
    columnDefs: [{
      orderable: false,
      targets: [3, 4],
    }],
  });

  $('#table-users').DataTable({
    columnDefs: [{
      orderable: false,
      targets: [2, 3],
    }],
  });
});
