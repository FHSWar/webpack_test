import { defineComponent } from 'vue'

export default defineComponent({
	setup() {
		const ab = {a: 1, b: 2}
		const c = {c: 3}
		const abc = {...ab, ...c}
		return () => (
			<div>contents{JSON.stringify(abc)}</div>
		)
	}
})