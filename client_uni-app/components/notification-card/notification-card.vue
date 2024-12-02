<template>
	
		<navigator :url="'/pages/postPage/postPage?id='+notification.post._id">
			<view class="user-box">
			<image :src="notification.handler.profilePic" mode="aspectFill" class="avatar"></image>
			<view class="flex">
				<view class="username" v-show="notification.type == 'like'">
					<text>{{notification.handler.username}}</text>
					<text class="tag">送出了一个爱心</text>
				</view>
				<view class="username" v-show="notification.type == 'comment'">
					<text>{{notification.handler.username}}</text>
					<text class="tag">发出了一个评论</text>
				</view>
				
				<text v-if="notification.type == 'comment'">“{{notification.comment.message}}”</text>
			
				<uni-dateformat class="postdate" :date="notification.createdAt" :threshold="[60000,3600000 * 24 * 365]"></uni-dateformat>
			</view>
			</view>
		</navigator>
		

	
</template>

<script>
	export default {
		name: "notification-card",
		props: {
			notification: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			
		},
		computed:{
			
		}
	}
</script>

<style>
	.user-box {
		display: flex;
		gap: 5px;
		padding: 12px;
		background-color: #ffffff;
		margin: 10px;
		border-radius: 5px;
	}

	.avatar {
		width: 43px;
		height: 43px;
		border-radius: 50%;
	}

	.tag {
		color: #888888;
		margin-left: 5px;
	}

	.createAt {
		color: #888888;
		font-size: 14px;
	}

	.flex {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>