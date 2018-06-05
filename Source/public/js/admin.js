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

function Edit(email) {}

function Delete(email, message) {
  if (confirm(message)) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/deleteUser');
    xhr.addEventListener('loadend', () => {
      window.location.reload();
    });
    xhr.send(`email=${email}`);
  }
}
