// import axios from 'axios'
// export default class Request {
// 	static async fetch(url, jsonData = {}, method = 'get', responseType) {
// 		const baseUrl = window.location.origin || 'http://localhost'
// 		let config = {
// 			baseURL: baseUrl,
// 			method: method,
// 			timeout: 15000
// 		}
// 		config = { ...config, ...responseType } //设置返回的数据类型
// 		if (method === 'get') {
// 			config = { params: jsonData, ...config }
// 		} else {
// 			config = { data: jsonData, ...config }
// 		}
// 		return axios(url, config)
// 			.then(response => {
// 				return response
// 			})
// 			.catch(error => {
// 				return {
// 					status: 500,
// 					statusText: error.message || 'network error',
// 					data: { status: 500, msg: error.message || 'network error' }
// 				}
// 			})
// 	}
// }