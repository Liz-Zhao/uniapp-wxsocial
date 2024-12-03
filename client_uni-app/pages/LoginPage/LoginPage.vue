<template>
	<view class="loginbox">
		<image :src="unLoginImg" mode="aspectFit" class="loginImg"></image>
		<button class="btn-login" @click="loginHandler">一键登录</button>
	</view>
</template>

<script>
	import { post } from '../../api/request';
	import unLoginImg from '../../static/unLogin.svg'
	import store from '../../store';
	export default {
		data() {
			return {
				unLoginImg,
			}
		},
		methods: {
			loginHandler() {
				uni.login({
					provider: 'weixin', //使用微信登录
					success: (loginRes) => {
						if (loginRes.errMsg === "login:ok") {
							post({url:'/signin',
							data: {
								code: loginRes.code
							},}).then((res)=>{
								store.commit('user/updateAuth', res.data);
								this.u_id = res.data._id;
								this.token = res.data.token
								this.username = res.data.username
								uni.reLaunch({
									url: '/pages/my/my'
								})
							})
						}
					}
				});
			},
			
		}
	}
</script>

<style lang="scss">
	@import'../../common/common.scss';
	
	.loginbox {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.loginImg{
			width: 50%;
		}
		.btn-login {
			width: 80%;
			background-color: $theme-color;
			color: $bg-color-white;
			margin: 15px auto;
		}
	}
	
</style>