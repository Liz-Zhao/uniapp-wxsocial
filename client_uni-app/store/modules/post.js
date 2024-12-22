
import { get,post,del, put } from "../../api/request"

export default {
	namespaced:true,
	state:{
		selected_post_id:'',
		posts:[],
	},
	getters:{
		// getSelectedPostID(state){
		// 	return state.selected_post_id
		// }
	},
	mutations:{
		setSelectedPostID(state, id){
			state.selected_post_id = id
		},
		setPosts(state,posts){
			// state.posts = [...state.posts, ...posts];
			state.posts = [ ...posts];
		},
		updatePostLike(state, payload){
			state.posts = state.posts.map((item)=> item._id == payload.id ?
			{...item, isliked: true, likes: item.likes+1}: item)
		},
		updatePostDislike(state, payload){
			state.posts = state.posts.map((item)=> item._id == payload.id ?
			{...item, isliked: false, likes: item.likes-1}: item)
		},
		deletePost(state,payload){
			state.posts = state.posts.filter((item)=> item._id !== payload.id)
		}
	},
	actions:{
		
	}
}