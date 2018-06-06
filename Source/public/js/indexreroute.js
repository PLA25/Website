let sec = 15;
const myTimer = document.getElementById('myTimer');
const myBtn = document.getElementById('myBtn');
window.onload = countDown;

function countDown() {
  if (sec < 10) {
    myTimer.innerHTML = `0${sec}`;
  } else {
    myTimer.innerHTML = sec;
  }
  if (sec <= 0) {
    $('#myBtn').removeAttr('disabled');
    $('#myBtn').removeClass().addClass('btnEnable');
    $('#myTimer').fadeTo(2500, 0);
    myBtn.innerHTML = 'Click Me!';
    return;
  }
  sec -= 1;
  window.setTimeout(countDown, 1000);
}
