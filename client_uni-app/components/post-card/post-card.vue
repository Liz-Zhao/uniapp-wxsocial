<template>
	
	<view class="post">
		<user-card :userInfo="post.author" :updatedDate="post.updatedAt">
			<uni-icons type="more-filled" size="25" @click="showMore" v-if="isShowMore"></uni-icons>
		</user-card>
		
		<navigator :url="'/pages/postPage/postPage?id='+post._id">
		<view class="post-context">
			<post-card-image :images="post.imagesUrl" ></post-card-image>
			<rich-text :nodes="formateNodes(post.message)" v-if="getMessage" ></rich-text>
		</view>
		</navigator>

		<view class="post-bottom">
			<view class="btn-box" @click="handleLikePost">
				 <uni-icons :type="localPost.isliked ? 'heart-filled' : 'heart'" size="25" color="#d81e06"></uni-icons>
				<text >{{localPost.likes}}</text>
			</view>
			<navigator :url="'/pages/postPage/postPage?id='+post._id">
				<view class="btn-box">
					<uni-icons type="chat" size="25"></uni-icons>
					<text v-if="isShowCommentNums">{{localPost.comments}}</text>
				</view>
			</navigator>
			
		</view>
	</view>
	

</template>

<script>

	import { del,post } from '../../api/request.js';
	import store from '../../store/index.js';

	export default {
		name: "post-card",
		props: {
			post: {
				type: Object,
				default: () => {}
			},
			
		},
		watch: {
		    post: {
		        immediate: true,
		        handler(newVal) {
		            this.localPost = { ...newVal }; // 深拷贝 post 数据到 localPost
		        }
		    }
		},
		data() {
			return {
				u_id: store.getters['user/user_id'],
				u_token: store.getters['user/token'],
				localPost: {}
			};
		},
		created() {
			// console.log('creatd',this.post._id)
			
		},
		onLoad() {
			// console.log('onLoad')
		},
		methods: {
			showMore() {
				store.commit('post/setPostID',this.post._id)
				store.commit('setting/showSetting')
			},

			handleLikePost(){
				if (this.u_token == '') {
					return uni.showToast({
						icon: 'fail',
						title: '请先登录后再试'
					})
				}
				
				store.commit('post/setUserID', this.u_id)
				store.commit('post/updatePost',this.localPost)
				// 调用 Vuex 的点赞逻辑
				store.dispatch('post/handleLikePostAction').then(() => {
					// 同步 Vuex 的数据到本地数据
					Object.assign(this.localPost, store.getters['post/getUpdatedPost']);
				});
			},
			formateNodes(str){
				if(str.length >= 40){
					str = str.slice(0,40) 
					str+= `<span style="color:#5351ff;">...查看更多</span>`
				}
				return str
			}

		},
		computed: {
			getMessage(){
				return !this.post.message ? false : true;
			},
			isShowMore(){
				if(!store.getters['user/userAuth']){
					return false
				}else if(store.getters['user/user_id'] !== this.post.author._id){
					return false
				}
				return true
			
			},
			isShowCommentNums(){
				return this.localPost.comments > 0 ? true: false
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