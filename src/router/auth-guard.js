export var authGuard = function (to, from, next) {
  var isAuthenticated = localStorage.getItem('LoggedUser')
  if (isAuthenticated) next();
  else next('/login');
}
