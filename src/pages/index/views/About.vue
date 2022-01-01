<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts" setup>
import Ajv from 'ajv'
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const schema = {
	type: 'object',
	properties: {
		foo: {type: 'integer'},
		bar: {type: 'string'}
	},
	required: ['foo'],
	additionalProperties: false
}
const data = {
	foo: 1,
	bar: 'abc'
}
const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) {
	console.log(validate.errors)
} else {
	console.log('valid', valid)
}
</script>

<style>

</style>