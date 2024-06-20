import router from '@/router/index';
import { createToaster } from "@meforma/vue-toaster";

var toast = createToaster({
  position: "bottom",
  duration: 4000,
  type: "error"
});
var intervalId = null;

export var sessionExpiry = (session) => {
  if(session==0) return clearInterval(intervalId);
  if(intervalId) clearInterval(intervalId);
  var sessionTimeout = session * 60 * 1000;
  var currentTime = Date.now();

  const checkTimer = () => {
    var lastActivityTime = Date.now();
    var elapsedTime = lastActivityTime - currentTime;
    if (elapsedTime > sessionTimeout) {
      clearInterval(intervalId);
      intervalId = null;
      router.push({ name: 'Logout' });
      return toast.show("Session Expired. Please Log in Again!");
    }
  };

  intervalId = setInterval(checkTimer, 1000);
};
