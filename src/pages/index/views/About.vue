<template>
	<div class="about">
		<h1>This is an about page</h1>
		<span>应该没问题的。</span>
	</div>
</template>

<script lang="ts" setup>
console.log('wow')
import Ajv from 'ajv'
const schemaValidator = new Ajv()

const innerSchema = {
	type: 'object',
	properties: {
		c: { type: 'string' },
		d: { type: 'number' }
	},
	required: ['c']
}
const innerArraySchema = {
	type: 'array',
	items: innerSchema
}
const schema = {
	type: 'object',
	properties: {
		a: { 'type': 'string' },
		b: { 'type': 'string' },
		obj: innerArraySchema
	},
	required: ['a']
}

const testSchemaValidator = schemaValidator.compile(schema)
const data = {
	a: '123',
	b: 'abc',
	obj: [{
		c: 'wow',
		d: 111
	}]
}
const valid = testSchemaValidator(data)
console.log(valid)
if (!valid) {
	console.log(testSchemaValidator.errors)
}
</script>

<style>
</style>