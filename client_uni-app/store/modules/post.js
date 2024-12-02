
import { get,post,del, put } from "../../api/request"

export default {
	namespaced:true,
	state:{
		post_id:'',
		// 追加字段 isliked
		post:{},
		comments:[],
		user_id: ''
	},
	getters:{
		isUserLiked(state){
			return state.post && state.post.isliked;
		},
		isLiked(state){
			return state.post.likes === 0 ? false: true
		},
		isCommented(state){
			return state.post.comments === 0 ? false: true
		},
		getUpdatedPost(state){
			return {
				...state.post,
				isliked: state.post.likedBy.includes(state.user_id)
			};
			
		},
		getPostID(state){
			return state.post_id
		}
	},
	mutations:{
		setPostID(state, post_id){
			state.post_id = post_id
		},
		setUserID(state,user_id){
			state.user_id = user_id
		},
		updatePost(state, post){
			state.post_id = post._id;
			state.post = {
				...post,
				isliked: post.likedBy.includes(state.user_id)
			}
		},
		likePost(state){
			state.post = {
				...state.post,
				isliked: true,
				likes: state.post.likes +1,
				likedBy: [...state.post.likedBy, state.user_id]
			}
		},
		unlikePost(state){
			state.post = {
				...state.post,
				isliked: false,
				likes: state.post.likes -1,
				likedBy: state.post.likedBy.filter(item=> state.user_id != item)
			}
			console.log('更新后：',state.post)
		},
		
	},
	actions:{
		getPostAction(context){
			return get({url:'/post/'+context.state.post_id}).then((res)=>{
				context.commit('updatePost', res.data)
			})
		},
		likePostAction(context){
			return post({url:'/post/'+ context.state.post_id+'/like'}).then(()=>{
				context.commit('likePost')
			})
		},
		unlikePostAction(context){
			return post({url:'/post/'+ context.state.post_id+'/unlike'}).then(()=>{
				context.commit('unlikePost')
			})
		},
		handleLikePostAction(context){
			console.log('更新前：',context.state.post)
			if(context.getters['isUserLiked']) {
				
				return context.dispatch('unlikePostAction')
			}else{
				return context.dispatch('likePostAction')
			}
		},
		deletePostAction(context){
			return del({url:'/post/'+context.state.post_id}).then(()=>{
				console.log('delete!')
			})
		},
		// editPostAction(context){
		// 	return put({url:'/post/'+context.state.post_id}).then(()=>{
		// 		console.log('edit')
		// 	})
		// }
	}
}