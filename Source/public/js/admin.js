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

// eslint-disable-next-line no-unused-vars
function Edit(email) {
  window.location.href = `/admin/editUser/${email}`;
}

// eslint-disable-next-line no-unused-vars
function Delete(email, message) {
  // eslint-disable-next-line no-restricted-globals
  if (confirm(message)) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/deleteUser');
    xhr.addEventListener('loadend', () => {
      window.location.reload();
    });
    xhr.send(`email=${email}`);
  }
}
