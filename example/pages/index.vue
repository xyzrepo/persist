<template>
  <div>
    Works!
    <strong>Test:</strong> {{ test }}
    <input v-model="test" type="checkbox" name="test">
    <br>
    <strong>NestedTest 1:</strong> {{ data.otherTest }}
    <input v-model="data.otherTest" type="checkbox" name="test2">
    <br>
    <strong>NestedTest 2:</strong> {{ data.anotherTest }}
    <input v-model="data.anotherTest" type="checkbox" name="test2">
    <button @click="resetState()">
      Clear
    </button>
  </div>
</template>

<script>
export default {
  persist: true,
  data () {
    return {
      test: false,
      data: {
        otherTest: false,
        anotherTest: false
      }
    }
  },
  mounted () {
    console.log(process.env.DEBUG)
  }
}
</script>
