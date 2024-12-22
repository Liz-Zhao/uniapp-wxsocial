<template>
	<view class="wrapper" v-show="visible">
		<view class="container">
			<!-- 评论 -->
			<view class="box" v-if="ItemType==='comment'">
				<!-- 删除评论 -->
				<view class="box-item" @click="deleteAComment">
					<text>删除</text>
				</view>
			</view>
			
			<!-- post -->
			<view class="box" v-else-if="ItemType==='post'">
				<view class="box-item" @click="deleteAPost" >
					<text style="color: red;">删除</text>
				</view>
				<view class="box-item" @click="editAPost">
					<text>编辑</text>
				</view>
			</view>
			
			
			<view class="btn-close" @click="hidePostMenu">
				<text class="btn-close-text">取消</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {del} from '../../api/request';
	import store from '../../store';
	import {mapState,mapMutations,mapGetters } from 'vuex';
	
	
	export default {
		name: "popup-bottom",
		props: {
			ItemType: {
				type: String,
				default: 'post'
			},
			commentID: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		methods: {
			...mapMutations({
				deletePost:'post/deletePost',
				hideSetting:'setting/hideSetting',
			}),
			hidePostMenu() {
				this.hideSetting();
			},
			deleteAPost() {
				const deletedPostID = store.getters['post/getSelectedPostID']
				del({url:'/post/'+deletedPostID}).then(()=>{
					this.deletePost({id:deletedPostID})
					this.hideSetting()
				})		
			},
			editAPost(){
				this.hideSetting()
				uni.reLaunch({
					url:'/pages/addPost/addPost?id='+ store.getters['post/getSelectedPostID']
				})
				
			},
			deleteAComment() {
				del({
					url: "/comment/" + this.commentID
				}).then(() => {
					uni.showToast({
						title: '成功删除！'
					})
					this.$emit('deleteComment', this.commentID)
				})
			},
		},
		computed: {
			...mapState({
				visible: state=>state.setting.visible
			})
			
		}

	}
</script>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 99;
	}

	.container {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #ffffff;
		z-index: 100;
		animation: slideUp 0.5s ease forwards;
	}

	.box .box-item {
		text-align: center;
		padding: 8px;
	}

	.btn-close {
		width: 100%;
		text-align: center;
		padding: 10px;
	}

	.btn-close .btn-close-text {
		color: #ccc;
	}

	/* 从下往上弹出的动画 */
	@keyframes slideUp {
		0% {
			transform: translateY(100%);
			/* 从下方100%位置开始 */
		}

		100% {
			transform: translate(0);
			/* 回到视图内的位置 */
		}
	}

	/* 从上往下隐藏的动画 */
	@keyframes slideDown {
		0% {
			transform: translate(0);
			/* 当前视图内位置 */
		}

		100% {
			transform: translate(100%);
			/* 隐藏在视图下方 */
		}
	}
</style>