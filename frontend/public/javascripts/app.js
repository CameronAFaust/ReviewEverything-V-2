// import { LocalStorage } from 'node-localstorage';
// localStorage = new LocalStorage('./scratch');

function onLogout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
}

// module.exports = {
//   onLogout
// }