<template>
	<view>
		<view class="uni-title uni-common-pl"></view>
		<view class="btns-box">
			<navigator url="/pages/index/index" open-type="switchTab">
				<view class="btn-cancel">取消</view>
			</navigator>

			<view class="btn-confirm" @click="handleAddPost">发布</view>
		</view>

		<!-- editor 编辑器 -->
		<view class="editor-wrapper">
			<editor id="editor" class="ql-container" placeholder="心情怎么样" @ready="onEditorReady" @input="onEditorInput">
			</editor>
		</view>
		
		<view class="uni-images-upload">
			<view class="image-prev" v-for="(item,index) in images" :key="index">
				<image :src="item" mode="aspectFill" style="width: 100%;height: 100%;"></image>
				
				<uni-icons type="close" size="30" color="#d81e06" class="btn-remove" @click="removeImageFromList(index)"></uni-icons>

			</view>
			<view class="btn-add" @click="uploadImage">
				<uni-icons type="plusempty" size="30" class="add-icon"></uni-icons>
			</view>

		</view>
	</view>
</template>

<script>
	import store from '../../store';
	import { BASE_URL, get, post,put } from '../../api/request';

	export default {
		data() {
			return {
				message: "",
				token: store.getters['user/token'],
				images: [],
				_images:[],
				editPostID: '',
				editorCtx:'',
				// isDataLoad: false, //仅初始化 加载时使用，例如编辑
			}
		},
		onLoad:function(option){
			if(option.id){
				this.editPostID = option.id;
				this.getPost()
			}else{
				return 
			}
		},
		methods: {
			getPost(){
				get({url:'/post/'+this.editPostID}).then(({data})=>{
					this.message = data.message;
					this.images = data.imagesUrl;
					this._images = data.images;
				})
			},
			handleAddPost() {
				
				if(this.editPostID){
					put({url:'/post/'+this.editPostID,
					data:{
						message: this.message, images:this._images
					}},
					).then(()=>{
						uni.reLaunch({
							url: '/pages/index/index'
						});
					})
				}else{
					post({
						url:'/post',
						data:{message: this.message, images:this._images}
					}).then((res)=>{
						uni.reLaunch({
							url: '/pages/index/index'
						});
					})
				}

			},
			uploadImage() {
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						const addImages = res.tempFilePaths;
						console.log(addImages,addImages[0])
						// 传多个文件需要反复调用本API。所以跨端的写法就是循环调用本API。
						addImages.forEach((item)=>{
							// 上传文件
							// console.log(item)
							// uni.removeInterceptor('request')
							uni.uploadFile({
								url: BASE_URL+'/photos/upload', 
								filePath: item,
								name: 'file',
								fileType:"image",
								header:{
									Authorization:'Bearer '+this.token,
									'Content-Type': 'multipart/form-data'
								},
								success: () => {
									const match = item.match(/tmp\/(.+)$/);
									this._images.push(match[1])
									// 1. 将新数组 push 到 images 中
									this.images.push(item);
									  
								},
								fail(res) {
									console.log(res)
								}
								
							});
							
						})
						
						
					}
				});
			},
			removeImageFromList(index) {
				this._images.splice(index, 1)
				this.images.splice(index,1)
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					 // 如果是编辑的话，就传入
					this.editorCtx.setContents({
						html: this.message
					})
				}).exec()
				
			},
			onEditorInput(e) {
				this.message = e.detail.html
				// console.log('编辑器内容发生变化：', e.detail.html);
			}
			
			
		}
	}
</script>

<style lang="scss">
	@import'../../common/common.scss';
	.btns-box {
		width: 100%;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid $btn-border-color;
		padding: 10px;
		
		.btn-cancel {
			color: $btn-border-color;
		}
		
		.btn-confirm {
			color: $theme-color;
		}
		
	}

	
	.btn-add {
		width: 60px;
		height: 60px;
		background-color:$btn-border-color;
		display: grid;
		place-items: center;
		text-align: center;
		margin: 10px;
		
		.add-icon {
			width: 100%;
		
		}
	}


	.uni-images-upload {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		
		.image-prev {
			width: 70px;
			height: 70px;
			position: relative;
			
			.btn-remove {
				width: 20px;
				height: 20px;
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}


	 /* 编辑器 */
	.editor-wrapper {
		background: $bg-color-white;
		
		.ql-container {
			padding: 12px 15px;
			width: 100%;
			min-height: 30vh;
			height: 100%;
			font-size: 16px;
			line-height: 1.5;
			
		}
		.ql-container  .ql-blank::before {
			  color: $input-color-placeholder;
			  font-style: normal;
		}
		
	}
		
	
</style>