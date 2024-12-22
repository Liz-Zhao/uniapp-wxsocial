<template>
	<view class="post">
		<user-card :userInfo="post.author" :updatedDate="post.updatedAt">
			<uni-icons type="more-filled" size="25" @click="showMore(post._id)" v-if="post.isOwn"></uni-icons>
		</user-card>

		<navigator :url="'/pages/postPage/postPage?id='+post._id" hover-class="none">
			<view class="post-context">
				<post-card-image :images="post.imagesUrl"></post-card-image>
				<rich-text :nodes="formateNodes(post.message)" v-show="post.message"></rich-text>
			</view>
		</navigator>

		<view class="post-bottom">
			<view class="btn-box" @click="handleLikePost(post._id)">
				<uni-icons :type="post.isliked ? 'heart-filled' : 'heart'" size="25" color="#d81e06"></uni-icons>
				<text v-show="post.likes >0">{{post.likes}}</text>
			</view>
			<navigator :url="'/pages/postPage/postPage?id='+post._id" hover-class="none">
				<view class="btn-box">
					<uni-icons type="chat" size="25"></uni-icons>
					<text v-show="post.comments >0">{{post.comments}}</text>
				</view>
			</navigator>
		</view>
		
	</view>
</template>

<script>
	import { post } from '../../api/request';
	import {mapState,mapMutations,mapGetters } from 'vuex';
	
	export default {
		name: "post-card",
		props:{
			post: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				
			}
		},
		computed:{
			...mapState({
				posts:state=>state.post.posts
			}),
		},
		methods: {
			...mapMutations({
				updatePostLike:'post/updatePostLike',
				updatePostDislike:'post/updatePostDislike',
				setSelectedPostID:'post/setSelectedPostID',
				showSetting:'setting/showSetting'
			}),
			showMore(id) {
				this.setSelectedPostID(id)
				this.showSetting()
			},
			handleLikePost(id) {
				const selectedPost = this.posts.find((item)=> item._id == id)
				if(selectedPost.isliked){
					// 已经点赞，则取消点赞
					post({url:'/post/'+ id+'/unlike'}).then(()=>{
						this.updatePostDislike({id})
					})
				}else{
					// 进行点赞
					post({url:'/post/'+ id+'/like'}).then(()=>{
						this.updatePostLike({id})
					})
				}
			},
			formateNodes(str) {
				if (str && str.length >= 40) {
					str = str.slice(0, 40)
					str += `<span style="color:#5351ff;">...查看更多</span>`
				}
				return str
			},
		},
	}
</script>

<style lang="scss">
	.post {
		width: 100%;
		padding: 16px;
		border-bottom: 1px solid #cccccc;

		.post-context {
			margin-bottom: 10px;

			.text {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 5;
				overflow: hidden;
				/* autoprefixer: ignore next */
				-webkit-box-orient: vertical;
			}
		}

		.post-bottom {
			display: flex;
			gap: 15px;
			align-items: center;

			.btn-box {
				display: flex;
				align-items: center;
			}
		}
	}
</style>