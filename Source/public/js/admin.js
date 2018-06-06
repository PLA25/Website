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
});

function DeleteHub(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/admin/deleteHub');
  xhr.addEventListener('loadend', () => {
    window.location.reload();
  });
  xhr.send(`id=${id}`);
}