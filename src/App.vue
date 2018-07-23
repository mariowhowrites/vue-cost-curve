<template>
  <div id="app" class="bg-grey-light h-screen">
    <h1 class="text-center">Price Curves</h1>
    <section class="w-4/5 h-half mx-auto flex mt-16">
      <div class="w-1/2">
        <price-chart height="300px"></price-chart>
      </div>
      <div class="cost-factors w-1/2">
        <cost-factors></cost-factors>
      </div>
    </section>
  </div>
</template>

<script>
import PriceChart from "./components/PriceChart.vue"
import CostFactors from "./components/CostFactors.vue"
import "./main.css"

export default {
  components: {
    PriceChart,
    CostFactors
  }
}

// x, y into formula. [[100, 20], [200, 40]] ⇒ x2 + 2x + 5


</script>

