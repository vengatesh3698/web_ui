<script>
export default {
	created() {
		localStorage.removeItem('LoggedUser');
		this.$cookies.remove('web-x-access-token');
		this.$cookies.remove('user_id');
		this.$cookies.remove('user_name');
		this.$cookies.remove('profile');
		this.$cookies.remove('role');
		this.$cookies.remove('mobile');
		this.$cookies.remove('email');
		this.$router.push('Login');
	}
}
</script>
<style>
body {
	background: linear-gradient(to bottom, #0d0d0d 50%, #0d0d0d 50%);
}
</style>
<template></template>