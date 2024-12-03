<template>

	<view class="message-box">
		
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="text"
				active-color="#5351ff" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				<notification-card v-for="(item,index) in list" :key="index" v-bind:notification="item"></notification-card>
				<view class="empty-notifi" v-show="list.length === 0">
					<image :src="unMessageImg" mode="aspectFit" class="notifi-image"></image>
					<view>暂无通知，快去寻找好友吧！</view>
				</view>
				
			</view>
			<view v-if="current === 1">
				<notification-card v-for="(item,index) in commentList" :key="index" v-bind:notification="item"></notification-card>
				<view class="empty-notifi" v-show="commentList.length === 0">
					<image :src="unMessageImg" mode="aspectFit" class="notifi-image"></image>
					<view>暂无评论，快去发表动态吧！</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import store from '../../store'
	import unMessageImg from '../../static/unMessage.svg'
	import {
		get
	} from '../../api/request';

	export default {
		data() {
			return {
				list: [],
				commentList:[],
				unMessageImg,
				items:['通知','评论'],
				current:0,
			}
		},
		onLoad() {
			const token = store.getters['user/token'];
			if (!token) {
				return
			} else {
				this.getNotificationList();
				this.getNotificationCommentList()
			}

		},

		onTabItemTap(item) {
			const token = uni.getStorageSync("userAuth"); // 检查登录状态
			if (!token) {
				return uni.reLaunch({
					url: "/pages/LoginPage/LoginPage",
				});
				
			}
			this.getNotificationList();
			this.getNotificationCommentList()
		},

		methods: {
			getNotificationList() {
				get({
					url: "/notifications?type=like"
				}).then((res) => {
					this.list = res.data;
				})
			},
			getNotificationCommentList() {
				get({
					url: "/notifications?type=comment"
				}).then((res) => {
					this.commentList = res.data;
				})
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			}
		},
		computed: {
			
		},
	}
</script>

<style lang="scss">
	@import'../../common/common.scss';
	page{
		background-color: $bg-color-grey;
	}
	.empty-notifi {
		text-align: center;
		width: 100%;
		margin: 20px auto;
	}
	.notifi-image {
		margin-bottom: 20px;
		width: 40%;
	}

	.message-box{
		padding-bottom: 20rpx;
	}
	.uni-padding-wrap{
		background-color: $bg-color-white;
	}
	.content{
		margin-top: 15px;
		
	}
	
</style>