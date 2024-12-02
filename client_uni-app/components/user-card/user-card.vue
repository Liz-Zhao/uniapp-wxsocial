<template>

	<view class="user-box">
		<view @click="toProfilePage" class="userInfo">
			<image :src="userInfo.profilePicUrl" mode="aspectFill" class="avatar " :class="avatarSize"></image>
			<view class="info">
				<view class="username">
					{{userInfo.username}}
				</view>

				<uni-dateformat class="postdate" :date="updatedDate"
					:threshold="[60000,3600000 * 24 * 365]"></uni-dateformat>
			</view>

		</view>

		<view class="slot-box">
			<slot></slot>
		</view>

	</view>

</template>

<script>
	import store from '../../store';
	export default {
		name: "user-card",
		data() {
			return {
				token: store.getters['user/userAuth']
			};
		},
		props: {
			userInfo: {
				type: Object,
				default: () => {}
			},
			updatedDate: {
				type: String,
				default: ''
			},
			avatarSize: {
				type: String,
				default: ''
			}
		},
		methods: {
			toProfilePage() {
				if (!this.token) {
					uni.navigateTo({
						url: '/pages/LoginPage/LoginPage'
					})
				} else {
					uni.reLaunch({
						url: '/pages/profile/profile?id=' + this.userInfo._id
					})
				}

			}
		}
	}
</script>

<style>
	.user-box {
		position: relative;
		margin-bottom: 10px;
	}
	.userInfo{
		display: flex;
	}

	.avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}

	.avatar.S {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}

	.user-box .info {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.user-box .info .username {
		color: #000000;
		font-size: 16px;
	}

	.user-box .info .postdate {
		color: #888888;
		font-size: 13px;
	}

	.icon {
		width: 25px;
		height: 25px;
	}

	.slot-box {
		position: absolute;
		right: 0px;
		top: 2px;
	}
</style>