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

// eslint-disable-next-line no-unused-vars
function DeleteHub(id, msg) {
  // eslint-disable-next-line no-restricted-globals
  if (confirm(msg)) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/deleteHub');
    xhr.addEventListener('loadend', () => {
      window.location.reload();
    });
    xhr.send(`id=${id}`);
  }
}
