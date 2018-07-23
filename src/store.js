import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import regression from "regression"
import Polynomial from "polynomial"

export default new Vuex.Store({
  state: {
    equations: [],
    composite: ""
  },

  getters: {
    // filters through all coordinates and selects lowest X Coordinate
    smallestXCoordinate: ({ equations }) => {
      const xCoordinates = equations
        .flatMap(equation => {
          return equation.data.map(coordinate => coordinate[0])
        })
        .filter(x => !!x)
        .sort()

      return xCoordinates[0]
    },

    // filters through all coordinates and selects highest X Coordinate
    largestXCoordinate: ({ equations }) => {
      const xCoordinates = equations
        .flatMap(equation => {
          return equation.data.map(coordinate => coordinate[0])
        })
        .filter(x => !!x)
        .sort()

      return xCoordinates[xCoordinates.length - 1]
    },

    // test to see whether eval worked -- all systems go
    evaluatedComposite: ({ composite }) => composite.eval(6)
  },

  mutations: {
    // add previously unknown (new label) equation to the mix
    addEquation({ equations }, equation) {
      equations.push(equation)
    },

    // remove old equation and add new equation to equations array
    updateEquation({ equations }, incomingEquation) {
      const otherEquations = equations.filter(
        equation => equation.label != incomingEquation.label
      )

      equations = [...otherEquations, incomingEquation]
    },

    // sets composite to value calculated in composite action
    updateComposite({ composite }, newComposite) {
      composite = newComposite
    }
  },
  actions: {
    processEquation({ state, commit }, costFactor) {
      // accept cost factor and create equation from cost factor coordinates
      const equation = regression.polynomial(costFactor.data, { order: 2 })

      // create equation object from derived equation and cost factor information
      const incomingEquation = Object.assign(Object.create(equationPrototype), {
        label: costFactor.label,
        equation: equation,
        data: costFactor.data
      })

      // either add or update state.equations based on whether equation exists already
      processEquation(state.equations, incomingEquation, commit)

      // build composite equation from new equations
      const composite = buildComposite(state.equations)

      // save compostion equation to state
      commit("updateComposite", composite)
    }
  }
})

// determines whether a given equation already exists by checking labels
//
// TODO: handle cases where name of label switches
// perhaps generate a pseudorandom number?
// could also help us key our coordinates as well. index numbers aren't cutting it
function processEquation(equations, incomingEquation, commit) {
  switch (
    // does every equation pass the test of not having the same label as the incoming equation?
    equations.every(equation => equation.label !== incomingEquation.label)
  ) {
    // if not, the equation already exists -- update it
    case false:
      commit("updateEquation", incomingEquation)
      break
    // otherwise, we're dealing with a new equation
    case true:
      commit("addEquation", incomingEquation)
  }
}

// builds a composite function
// switches the regression.js equation to polynomial.js using transformEquation
// then goes across the equations array and adds each equation together
function buildComposite(equations) {
  return equations.reduce((accumulator, equation) => {
    // first, transform the equation
    transformedEquation = transformEquation(equation.equation)

    // if this is the first equation (accumulator is still 0)
    // create new polynomial
    // otherwise add new polynomial to accumulator
    return accumulator === 0
      ? new Polynomial(transformedEquation)
      : accumulator.add(transformedEquation)
  }, 0) // default to check against
}

function transformEquation(equation) {
  return equation.string.slice(4).replace(/ /g, "")
}

const equationPrototype = {
  label: "",
  equation: "",
  data: ""
}
