<template>
	<view class="profile-container">
		<view class="profile-header">
			<image :src="profilePic" mode="aspectFill" class="avatar"></image>
			<view class="username">{{username}}</view>
			<view class="btn-follow" v-show="!isOwn" @click="handleFollow">{{isFollowed ? "已关注": "关注"}}</view>
		</view>
	
		<view>关于我</view>
		<view class="desc">{{desc}}</view>
		<uni-icons type="gear-filled" size="30" class="setting-btn" @click="toEditPage" v-if="isOwn"></uni-icons>
	
	</view>
	
	<view>
	    <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#5351ff"></uni-segmented-control>
	    <view class="content">
	        <view v-show="current === 0">
				<!-- 没有发帖缺省页面 -->
	            <view class="empty-post-box" v-if="emptyList">
	            	<image :src="unPostImg" mode="aspectFit" class="empty-post"></image>
	            	<view class="btn-post">无内容，去发帖！</view>
	            </view>
				
				<view v-else>
					<!-- <post-list :list="list"></post-list> -->
					
				</view>
				
	        </view>
	        <view v-show="current === 1">
	            <view style="text-align: center;margin-top: 20px;" v-if="emptyFollowList">暂无关注</view>
	            <view v-else class="follow-box" v-for="(item,index) in followList" :key="index">
	            	<user-card :user-info="item" >
	            		<view class="btn-follow" @click.stop="handleFollowList(item._id, item.isFollowed)" v-show="isOwn==true">{{item.isFollowed? "已关注": "关注"}}</view>
	            	</user-card>
	            </view>
	        </view>
	    </view>
	</view>
</template>

<script>
	import store from '../../store';
	import unPostImg from '../../static/unPost.svg'
	import {get, post} from '../../api/request';
	
	export default {
		data() {
			return {
				username:"",
				profilePic:"",
				desc:"",
				userID:"",
				token: store.getters['user/token'],
				user_id:store.getters['user/user_id'],
				list:[],
				unPostImg,
				items: ['帖子', '关注'],
				current: 0,
				isFollowed:'',
				followList:[]
			}
		},
		onLoad:function(option){
			this.userID = option.id;
			
			this.getProfile()
			this.getMyPost()
			
		},
		methods: {
			getProfile() {
				get({
					url: "/user/"+ this.userID
				}).then((res) => {
					this.username = res.data.username;
					this.desc = res.data.description;
					this.profilePic = res.data.profilePicUrl;

					this.isFollowed = res.data.following.includes(this.user_id) ? true : false
					
					this.followList = res.data.follow.map((item)=>{
						return {
							...item,
							isFollowed: true,
						}
					});

				})
			
			},
			getMyPost() {
				get({url:"/posts", data:{author: this.userID}}).then(({data})=>{
					this.list = data
					
				})
			},
			toLoginPage() {
				uni.navigateTo({
					url: '/pages/LoginPage/LoginPage'
				})
			},
			toEditPage() {
				uni.navigateTo({
					url: '/pages/editProfile/editProfile'
				})
			},
			handleFollow(){
				if(this.isFollowed){
					post({url:"/user/"+this.userID+"/unfollow"}).then(()=>{
						this.isFollowed = false;
					})
				}else{
					post({url:"/user/"+this.userID+"/follow"}).then(()=>{
						this.isFollowed = true;
					})
				}
			},
			onClickItem(e) {
			  if (this.current != e.currentIndex) {
				this.current = e.currentIndex;
			  }
			},
			handleFollowList(user_id, isFollowed){
				if(isFollowed){
					post({url:"/user/"+user_id+"/unfollow"}).then(()=>{
						this.followList = this.followList.map((item)=>{
							if(item._id == user_id){
							return {
								...item,
								isFollowed: false
							}	
							}else{
								return item
							}
							
						})
					})
				}else{
					post({url:"/user/"+user_id+"/follow"}).then(()=>{
						this.followList = this.followList.map((item)=>{
							if(item._id == user_id){
							return {
								...item,
								isFollowed: true
							}	
							}else{
								return item
							}
							
						})
					})
				}
			}
			
			
		},
		computed:{
			emptyList() {
				return this.list.length === 0 ? true : false;
			},
			isOwn(){
				if(store.getters['user/user_id'] == this.userID){
					return true
				}else{
					return false
				}
			},
			emptyFollowList(){
				return this.followList.length === 0 ? true: false
			}
			
		}
	}
</script>

<style lang="scss">
	@import'../../common/common.scss';
	
	.profile-container{
		width: 100%;
		margin-top: 20px;
		position: relative;
		padding: 0 10px;
		.profile-header{
			display: flex;
			gap: 15px;
			align-items: center;
			margin-bottom: 10px;
		}
		.avatar {
			width: 60px;
			height: 60px;
			border-radius: 50%;
		}
		.username{
			font-weight: bold;
			font-size: 18px;
			margin: 5px ;
		}
		.desc{
			color: #8f8f8f;
		}
		.setting-btn{
			position: absolute;
			right: 10px;
			top: 0px;
		}
	}
	
	
	/* my post 缺省模块 */
	.empty-post-box {
		width: 100%;
		text-align: center;
		margin: 20px auto;
		
		.empty-post {
			width: 40%;
		}
		
		.btn-post {
			border: 1px solid $btn-border-color;
			width: 200px;
			border-radius: 20px;
			padding: 5px 0;
			margin: 10px auto;
		}
	}

	.btn-follow{
		color: #ffffff;
		background-color: $theme-color;
		padding: 10px 28px;
		border-radius: 20px;
	}

	
	.follow-box{
		margin: 10px;
		.btn-follow{
			color: #ffffff;
			background-color: $theme-color;
			padding: 5px 18px;
			border-radius: 20px;
		}
	}
	
</style>
