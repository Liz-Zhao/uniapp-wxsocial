
const defaultOptions = {
	timeout:15000,
	dataType:'json',
	header:{
		'content-type':'application/json',
	},
};

const BASE_URL = 'http://127.0.0.1:8001'
const TOKEN_KEY = 'userAuth';
const LOADING_DELAY = 10; // 50ms 延迟
let loadingTimer;

const handleURL = (request) => {
  const { url } = request;
  if (!/https|http/.test(url)) {
    request.url = url.startsWith('/')
      ? `${BASE_URL}${url}`
      : `${BASE_URL}/${url}`;
  }
};

const handleToken = (request) => {
  const token = uni.getStorageSync(TOKEN_KEY);
  // console.log(token)
  if (token) {
    request.header.Authorization = 'Bearer '+token.token;
  }
};

const showLoading = () => {
  uni.showLoading({
    title: '加载中',
  });
};

const hideLoading = () => {
  uni.hideLoading();
};


/* 封装请求 */
const wrapRequest = ({
  url = '',
  data = {},
  method = 'GET',
  header = {},
  loading = true,
} = {}) => {
  return uni.request({
    ...defaultOptions,
    url,
    data,
    method,
    loading,
    header: {
      ...defaultOptions.header,
      ...header,
    },
  });
};

/* 前置处理器 */
uni.addInterceptor('request', {
  invoke(args) {

	if(args.loading){
		 loadingTimer = setTimeout(showLoading, LOADING_DELAY);
	}
	handleURL(args);
	handleToken(args)
  },
  success(args) {
	  const {data:resData} = args;
	  const {code,message,data} = resData;
	  if(code !== 200){
		  // 401 token 验证失败
		  if(code == 401){
			uni.showToast({
				title: message,
				icon:'none'
			});
			uni.navigateTo({
				url:'/pages/LoginPage/LoginPage'
			})
			return
		  }
		  return Promise.reject(resData)
	  }
	  return Promise.resolve(resData)
    // 请求成功后，修改code值为1
    // args.data.code = 1
	hideLoading()
  },
  fail(err) {
    // console.log('interceptor-fail',err)
	hideLoading();
  },
  complete(res) {
    // console.log('interceptor-complete',res)
	clearTimeout(loadingTimer);
	hideLoading();
  }
})

export const get = (params) => wrapRequest({ ...params, method: 'GET' });
export const post = (params) => wrapRequest({ ...params, method: 'POST' });
export const put = (params) => wrapRequest({ ...params, method: 'PUT' });
export const del = (params) => wrapRequest({ ...params, method: 'DELETE' });