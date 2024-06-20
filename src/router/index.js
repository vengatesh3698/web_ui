import { createWebHistory, createRouter } from 'vue-router';
import { authGuard } from './auth-guard';

const routes = [
	{path: '/:catchAll(.*)', redirect:{name:'Login'}},
	{
		path:'/login',
		name:'Login',
		component:()=>import('@/components/authentication/Layout.vue')
	},{
		path:'/admin',
		name:'PageLayout',
		beforeEnter:authGuard,
		component:()=>import('@/components/authentication/PageLayout.vue'),
		children:[
			{
				path:'/dashboard',
				name:'Dashboard',
				component:()=>import('@/components/Pages/dashboard.vue')
			},
			{
				path:'/manage/category',
				name:'Category',
				component:()=>import('@/components/Manage/category.vue')
			},
			{
				path:'/manage/ott',
				name:'Ott',
				component:()=>import('@/components/Manage/ott.vue')
			},
			{
				path:'/manage/webseries',
				name:'webseries',
				component:()=>import('@/components/Manage/webseries.vue')
			},
			{
				path:'/manage/appupdate',
				name:'Appupdate',
				component:()=>import('@/components/Manage/appupdate.vue')
			},
			{
				path:'/manage/logo',
				name:'Logo',
				component:()=>import('@/components/Manage/logo.vue')
			},
			{
				path:'/manage/channel',
				name:'Channel',
				component:()=>import('@/components/Manage/channel.vue')
			},
			{
				path:'/manage/subscriber',
				name:'Subscriber',
				component:()=>import('@/components/Manage/subscriber.vue')
			},
			{
				path:'/manage/package',
				name:'Package',
				component:()=>import('@/components/Manage/package.vue')
			},
			{
				path:'/manage/reseller',
				name:'Reseller',
				component:()=>import('@/components/Manage/reseller.vue')
			},
			{
				path:'/manage/app',
				name:'App',
				component:()=>import('@/components/Manage/app.vue')
			},
			{
				path:'/manage/advertisement',
				name:'Advertisement',
				component:()=>import('@/components/Manage/advertisement.vue')
			},
			{
				path:'/account/profile',
				name:'Profile',
				component:()=>import('@/components/account/updateProfile.vue')
			},
			{
				path:'/manage/credit',
				name:'Credit',
				component:()=>import('@/components/Manage/credit.vue')
			},{
				path:'/account/aboutus',
				name:'Aboutus',
				component:()=>import('@/components/account/aboutus.vue')
			},{
				path:'/login',
				name:'Logout',
				component:()=>import('@/components/authentication/Logout.vue')
			}
		]
	}
];

const router = createRouter({
	history: createWebHistory(),
	hash:false,
	routes,
});

export default router;