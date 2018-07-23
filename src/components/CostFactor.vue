<template>
  <div class="cost-factor flex items-center flex-col my-8">
    <h1 class="text-center">{{ label }}</h1>
    <input class="w-1/2 my-4" type="text" v-model="label" placeholder="label">
    <button v-if="label" class="bg-green text-white my-4 px-2 py-1 rounded shadow" @click="coordinates.push([])">Add Coordinate</button>
    <section class="flex flex-col">
      <coordinate 
        v-for="(coordinate, index) in coordinates" 
        @coordinateUpdated="updateCoordinate"
        @destroy="destroyCoordinate"
        :key="index"
        :index="index" 
        class="w-full my-2"
      >
      </coordinate>
    </section>
  </div>
</template>

<script>
import Coordinate from "./Coordinate.vue"
import { mapActions } from "vuex"

export default {
  data() {
    return {
      label: "",
      coordinates: []
    }
  },
  methods: {

    // primary method for updating coordinates and triggering equation updates accordingly
    updateCoordinate(updatedCoordinate) {

      // either add or update coordinate based on whether it exists
      this.handleCoordinate(updatedCoordinate)

      // SIDE EFFECT: cleans out unused coordinates (necessary to remove empty coordinates before possibly updating equation state)
      this.coordinates = this.coordinates.filter(
        coordinate => coordinate.length > 0
      )

      // if our criterion are met, change equation state
      this.possiblyChangeEquationState()

      // add new coordinate for easier UX
      this.coordinates.push([])
    },

    // adds or updates coordinate based on whether it exists in coordinates array already
    handleCoordinate(coordinate) {

      // see if changed coordinate already exists (ie. updated X coordinate matches X coordinate from coordinates)
      const index = this.coordinates.findIndex(
        existingCoordinate => existingCoordinate[0] == coordinate[0]
      )

      // if -1, index doesn't exist: add it. otherwise, update the existing index
      switch (index) {
        case -1:
          this.coordinates.push(coordinate)
          break
        default:
          this.coordinates[index] = coordinate
      }
    },

    // check to see whether we have enough data for an equation
    // if we do, update equations state accordingly
    possiblyChangeEquationState() {
      if (this.atLeastSixPoints(this.coordinates)) {
        this.processEquation({ label: this.label, data: this.coordinates })
      }
    },

    // at least 3 coordinates and all coordinates have two positive values
    atLeastSixPoints(coordinates) {
      return (
        coordinates.length >= 3 &&
        coordinates.every(coordinate => coordinate.length === 2)
      )
    },

    // clean up our index and (possibly) update equation data accordingly
    destroyCoordinate(index) {
      this.coordinates.splice(index, 1)

      this.possiblyChangeEquationState()
    },

    // mapping in processEquation from store.js
    ...mapActions(["processEquation"])
  },
  components: {
    Coordinate
  }
}

// an array
// the ability to push x, y values onto array
// cost curve: [[0, 1], [2, 20], [3, 30]]
</script>