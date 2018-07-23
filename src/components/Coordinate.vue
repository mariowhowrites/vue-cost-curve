<template>
  <span class="flex justify-around">
    <input v-model="xCoordinate" @input="updateCoordinate" type="number" name="x-coordinate" id="" class="w-1/3">
    <button @click="destroy" class="bg-red text-white py-1 px-3 rounded-full shadow">-</button>
    <input v-model="yCoordinate" @input="updateCoordinate" type="number" name="y-coordinate" id="" class="w-1/3">
  </span>
</template>

<script>
export default {
  props: ['index'],
  data() {
    return {
      xCoordinate: 0,
      yCoordinate: 0
    }
  },
  methods: {
    updateCoordinate() {
      if (this.xCoordinate > 0 && this.yCoordinate > 0) {
        const coordinate = [this.xCoordinate, this.yCoordinate]
        this.$emit("coordinateUpdated", coordinate)
      }
    },
    destroy() {
      this.$emit("destroy", this.index)
    },
  }
}
</script>