<script>
	import {
		post
	} from './api/request';
	import store from './store';

	export default {
		onLaunch: function(options) {

			// 已登录，不再重复登录
			if (!store.getters['user/userAuth']) {
				uni.showLoading({
					title: '加载中'
				})
				uni.login({
					provider: 'weixin', //使用微信登录
					success: (loginRes) => {

						if (loginRes.errMsg === "login:ok") {
							post({
								url: '/signin',
								data: {
									code: loginRes.code
								},
							}).then((res) => {
								store.commit('user/updateAuth', res.data);
								uni.hideLoading();
							})
						}
					}
				});
			}

		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>


<style lang="scss">
	page,
	view,
	button,
	textarea {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	view {
		font-family: STHeiti;
	}
</style>