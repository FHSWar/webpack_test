import { defineComponent } from 'vue'
import './style.scss'
export default defineComponent({
	setup() {
		const ab = {a: 1, b: 2}
		const c = {c: 3}
		const abc = {...ab, ...c}
		return () => (
			<div class={'wow'}>123contents{JSON.stringify(abc)}</div>
		)
	}
})