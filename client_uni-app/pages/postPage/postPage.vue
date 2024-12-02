<template>
	<view>
		<user-card :userInfo="post.author" :updatedDate="post.updatedAt">
		</user-card>
		<view v-if="ImageStatus">
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
					:interval="interval" :duration="duration">
					<swiper-item v-for="(item,index) in post.imagesUrl" :key="index">
						<view class="swiper-item "  @click="clickImg(item)">
							<image :src="item" mode="aspectFill"></image>
						</view>
					</swiper-item>

				</swiper>
			</view>
		</view>
		<!-- 文字区域 -->
		<view class="message">
			<rich-text :nodes="post.message" ></rich-text>
		</view>

		<!-- 评论展示区域 -->
		<view class="comments-box">
			<view class="comment-nums">评论 {{post.comments}}</view>
			<view class="comment-item" v-for="(item,index) in comment_list" :key="index">
				<view>
					<user-card :userInfo='item.user' :updatedDate="item.updatedAt" :avatarSize="userIconSize"
						v-if="item.user">
						<uni-icons type="more-filled" size="25" @click="showMore(item._id)" v-show="isShowMore"></uni-icons>
					</user-card>
					<rich-text :nodes="item.message" @click.stop="handleReply(item._id, item._id)" ></rich-text>
				</view>

				<view class="replies-box">
					<view v-for="(p,index) in item.replies" :key='p._id' 
						style="margin-bottom: 10px;">
						<user-card :userInfo='p.user' :updatedDate="p.updatedAt" :avatarSize="userIconSize">
							<uni-icons type="more-filled" size="25" @click="showMore(p._id)" v-show="isShowMore"></uni-icons>
						</user-card>
						
						<view @click.stop="handleReply(item._id, p._id)">
							<view v-if="p.replyTo && p.replyTo.user">回复@<text
									style="color: #5351ff;">{{p.replyTo.user.username}}</text>：{{p.message}}</view>
							<view v-else-if="p.replyTo && !p.replyTo.user"><text
									style="color: red;">{{p.replyTo.message}}</text>：{{p.message}}</view>
							<view v-else>{{p.message}}</view>
						</view>
						
					</view>
				</view>

			</view>

			<view class="comments-box-bottom" v-if="postCommentLength">
				到底了~~
			</view>
			<view class="comments-box-bottom" v-else>
				暂无评论
			</view>

		</view>


		<!-- 底部固定评论输入框，默认 isTextareaVisible : false 不显示；弹出显示-->
		<!-- 遮罩层 -->
		<view class="c-wrapper" v-if="isTextareaVisible"  @click="hideTextarea"></view>
		<!-- 弹窗 -->
		<view ref="textarea" class="comment-box " :class="!isTextareaVisible? 'hide': ''" :style="'padding-bottom:'+inputBottom+'px;'">
			<!-- :style="{bottom: inputBottom +'px'}" -->
			<!-- <textarea v-model="comment" placeholder="说点什么..." :maxlength="maxlength" :cursor-spacing="10" @click.stop=""
			class="comment-input" :fixed="true" :show-confirm-bar="false" :adjust-position="false" :auto-height='true'
			@focus="focusTextarea" @blur="blurTextarea" /> -->
			<textarea v-model="comment" placeholder="说点什么..." :maxlength="maxlength" :cursor-spacing="10" 
			class="comment-input" :fixed="true" :show-confirm-bar="false" :auto-height='true' :adjust-position="false"
			@focus="focusTextarea" @blur="blurTextarea"
			 />
			
			<view class="operation-toolkit " v-if="!isTextareaVisible" >
				<view>
					<uni-icons type="chat" size="30"></uni-icons>
					<text>{{post.comments}}</text>
				</view>
				<view>
					<uni-icons :type="post.isliked ? 'heart-filled' : 'heart'" size="30" color="#d81e06" @click.stop="handleLikePost"></uni-icons>
					<text>{{post.likes}}</text>
				</view>
				<view><uni-icons type="star" size="30"></uni-icons></view>
			</view>
			
			<view class="comment-tip" v-if="isTextareaVisible">
				<text class="quote">{{inputLength}}</text>
				<view class="btn-comment " :class="BtnIsSubmit? 'active': ''" @click.stop="createComment">提交</view>
			</view>
			
		</view>
		

	</view>
	
	<popup-bottom :ItemType="ItemType" :commentID="editCommentID" @deleteComment='removeComment'></popup-bottom>
</template>

<script>
	import {
		del,
		get,
		post
	} from '../../api/request';
	import store from '../../store';

	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500,
				post_id: '',
				post: {
					author: {},
					images: [],
					likedBy: []
				},
				comment: '',
				comment_list: [],
				isTextareaVisible: false,
				maxlength: 200,
				u_token: uni.getStorageSync('userAuth') || '',
				userIconSize: 'S',
				ItemType: 'comment',
				editCommentID: '',
				pid: null,
				replyid: null,
				inputBottom:20,

			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			store.commit('post/setUserID', store.getters['user/user_id'])

			this.post_id = option.id
			store.commit('post/setPostID', option.id)

			store.dispatch('post/getPostAction').then(() => {
				this.post = store.getters['post/getUpdatedPost']

			})
			// this.getPost()
			this.getCommentList()
		},
		onShow() {
			
		},
		methods: {
			getCommentList() {
				get({
					url: "/comments",
					data: {
						post_id: this.post_id,
						limit: 10,
						page: 1
					}
				}).then((res) => {
					this.comment_list = res.data
				})
			},
			createComment() {
				if (!this.BtnIsSubmit) return
				if (this.pid) {
					post({
						url: "/comment",
						data: {
							message: this.comment,
							post_id: this.post_id,
							pid: this.pid,
							replyid: this.replyid
						}
					}).then(({data}) => {
						this.inputStatus = false
						this.comment_list= this.comment_list.map((item)=>{
							if(item._id == this.pid){
								return {
									...item,
									replies:[
										{
											...data,
											updatedAt: '刚刚',
											user:{
												username: store.getters['user/username'],
												profilePicUrl: store.getters['user/profilePicUrl'],
											}
										},
										...(item.replies || []), // 确保 replies 为数组
									]
								}
							}else{
								return item
							}
						})
					})
				} else {
					post({
						url: "/comment",
						data: {
							message: this.comment,
							post_id: this.post_id
						}
					}).then(({data}) => {
						this.inputStatus = false
						this.comment_list=[ {
							...data,
							updatedAt:'刚刚',
							user:{
								username: store.getters['user/username'],
								profilePicUrl: store.getters['user/profilePicUrl'],
							}
						},...this.comment_list]
						
					})
				}

				this.inputStatus = true;
				this.comment = ''
			},

			// 显示真正的输入框 (textarea)
			showTextarea() {
			  this.isTextareaVisible = true;
			  this.pid = null;
			  this.replyid = null;
			},
			// 隐藏真正的输入框 (textarea)
			hideTextarea() {
			  this.isTextareaVisible = false;
			  this.inputBottom = 20;
			},
			handleLikePost(e) {
				if (this.u_token == '') {
					return uni.showToast({
						icon: 'fail',
						title: '请先登录后再试'
					})
				}

				store.commit('post/updatePost', this.post)
				// 调用 Vuex 的点赞逻辑
				store.dispatch('post/handleLikePostAction').then(() => {
					// 同步 Vuex 的数据到本地数据
					Object.assign(this.post, store.getters['post/getUpdatedPost']);
				});
			},
			showMore(commentID) {
				store.commit('setting/showSetting')
				this.editCommentID = commentID;
			},
			removeComment(id) {
				store.commit('setting/hideSetting')
				del({
					url: '/comment/' + this.editCommentID
				}).then(res => {
					uni.showToast({
						title: '成功删除'
					})
				})
				
				this.comment_list = this.comment_list.filter((item)=> item._id !== id)
			},
			handleReply(pid, replyid) {
				this.isTextareaVisible = true;
				this.pid = pid;
				this.replyid = replyid;
			},
			clickImg(imgUrl){
				uni.previewImage({
					urls:[imgUrl],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					},
					success: (res) => {
						
					},
					fail() {
						
					}
				})
			},
			focusTextarea(e){
				this.inputBottom = e.detail.height;
				this.isTextareaVisible = true
			},
			blurTextarea(e){
				this.inputBottom = 20;
				this.isTextareaVisible=false;
				
			},
			

		},
		computed: {
			ImageStatus() {
				return this.post.images.length === 0 ? false : true
			},
			BtnIsSubmit() {
				return this.comment.length > 0 ? true : false;
			},
			inputLength() {
				return this.comment.length + '/' + this.maxlength;
			},
			isShowMore() {
				if (!store.getters['user/userAuth']) {
					return false
				}
				return true
			},
			postCommentLength(){
				return this.post.comments >0 ? true: false;
			}

		},

	}
</script>

<style>
	.swiper {
		width: 100%;
		max-height: 460px;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
	}

	.swiper-item image {
		width: 100%;
		height: 100%;
	}

	.btn-follow {
		position: absolute;
		right: 0;
	}

	.comments-box {
		border-top: 1px solid #cccccc;
		padding-bottom: 100px;
		background-color: #fff;
	}
	.comment-nums{
		margin: 10px;
		font-weight: 700;
	}

	.comments-box-bottom {
		color: #d8d4d1;
		font-size: 16px;
		text-align: center;
		margin-top: 20px;
	}

	.comment-item {
		width: 100%;
		padding: 10px;
		border-bottom: 1px solid #cccccc;
		background-color: #fff;
	}

	.replies-box {
		margin-left: 10px;
		margin-top: 10px;
		padding-left: 10px;
		border-left: 2px solid #cccccc;
	}
	
	.c-wrapper{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 12;
	}
	.comment-box {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		z-index: 30;
		padding: 10px;
	}
	.comment-box.hide{
		display: flex;
		gap: 20px;
		justify-content: space-between;
		align-items: center;
	}
	.comment-box.show{
		display: flex;
		flex-direction: column;
	}
	.comment-input {
		background-color: #cccccc;
		border-radius: 10px;
		width: 100%;
		padding: 10px;
		max-height: 250px;
	}
	.operation-toolkit{
		display: flex;
		gap: 5px;
	}
	.comment-box .comment-tip{
		width: 100%;
		display: flex;
		gap: 5px;
		align-items: center;
		justify-content: flex-end;
		margin-right: 5px;
		margin-top: 5px;
	}

	.comment-tip .btn-comment {
		border: 1px solid #cccccc;
		color: #cccccc;
		border-radius: 10px;
		padding: 5px 10px;
	}

	.btn-comment.active {
		border-color: #5351ff;
		color: #5351ff;
	}

	.message {
		padding: 10px 10px;
		line-height: 20px;
	}



</style>