
function logout() {
FB.getLoginStatus(function(response) {
  if (response && response.status === 'connected') {
      FB.logout(function(response) {
          document.location.reload();
        });
      }
  });
}
