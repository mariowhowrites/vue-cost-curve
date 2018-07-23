<template>
  <div>
    <h2>Cost Factors!!</h2>
    <cost-factor></cost-factor>
    <h1>Equations</h1>
    <div v-for="equation in equations" :key="equation.label">
      {{ equation.equation }}
    </div>
    <h1>Composite</h1>
    <div>{{ composite }}</div>
    <h1>Useful Numbers</h1>
    <div>{{ smallestXCoordinate }}</div>
    <div>{{ largestXCoordinate }}</div>
    <div>{{ evaluatedComposite }}</div>
  </div>
</template>

<script>
import CostFactor from "./CostFactor.vue"
import { mapState, mapGetters } from "vuex"

export default {
  components: {
    CostFactor
  },
  computed: {
    ...mapState(['equations', 'composite']),
    ...mapGetters(['smallestXCoordinate', 'largestXCoordinate', 'evaluatedComposite'])
  }
}
</script>