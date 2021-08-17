import Vue from 'vue'
import Vuex from 'vuex'
// import {Store} from 'vuex'
// import forEach from "lodash/forEach";
// import merge from 'lodash/merge';
// import omit from 'lodash/omit';
// import pick from 'lodash/pick';
// import isNil from 'lodash/isNil';
// import isEmpty from 'lodash/isEmpty';
import { forEach, isNil, isEmpty, merge, omit, pick } from 'lodash'
import createPersistedState from 'vuex-persistedstate'
const Store = Vuex.Store
const isObject = obj => typeof obj === 'object'
const sanitizeObject = (data, deep = true, filterExpression = key => key[0] !== '_') =>
  Object.keys(data)
    .filter(filterExpression)
    .reduce((obj, key) => {
      obj[key] =
        (deep && isObject(data[key]))
          ? sanitizeObject(data[key], filterExpression)
          : data[key]
      return obj
    }, {})

const applyFilters = (data, options) => {
  const { includePaths, excludePaths } = options
  let result = sanitizeObject(data, true)
  const namespaced = (arr, { namespace }) => arr.map(entry => `${namespace}.${entry}`)
  result = !isEmpty(excludePaths) ? omit(result, namespaced(excludePaths, options)) : result
  result = !isEmpty(includePaths) ? pick(result, namespaced(includePaths, options)) : result
  return result
}
const RESTORE_STATE = (state, target) => {
  if (isNil(state) || isEmpty(state)) {
    // console.log('restoreState error, state does not exists', state, target);
    return
  };
  if (isNil(target)) {
    // console.log('restoreState error, target does not exists', state, target);
    const vm = new Vue()
    target = vm.$data
  }
  // console.log('RESTORE_STATE executed', state, target);
  const savedState = merge({}, target, state)
  forEach(savedState, (value, key) => { target[key] = value })
}
const SET_STATE = (state, newState) => merge(state, newState)
const createStore = (store) => {
  if (store instanceof Store) {
    // console.log('store already exists', store);
    return store
  } else {
    Vue.use(Vuex)
    store = new Store()
    // console.log('store created', store);
    return store
  }
}
const createStoreModule = (store, { namespace }) => {
  store = createStore(store)
  store.registerModule(namespace, {
    namespaced: true,
    mutations: { save: SET_STATE, restore: RESTORE_STATE },
    actions: {
      saveState: ({ commit }, payload) => commit('save', payload),
      restoreState: ({ commit }, payload) => commit('restore', payload)
      // nuxtServerInit: ({ commit }, context) => commit('restore', context),
    }
  })
  // console.log('store module created', store);
  return store
}
const createMixin = (store, { namespace }) => {
  // console.log('mixin created', store);
  Vue.mixin({
    mixins: [
      {
        methods: {
          saveState (source = this.$data) {
            source = this.$data
            store.dispatch(namespace + '/saveState', source)
          },
          restoreState (target = this.$data) {
            target = this.$data
            store.dispatch(namespace + '/restoreState', target)
          }
        }
      }
    ]
  })
}

const persist = (store, options = { key: 'storage', namespace: 'state' }) => {
  // Setup Vuex store module to handle persisted state
  store = createStoreModule(store, options)
  // Setup Vuex Persisted State Plugin
  createPersistedState({ ...options, reducer: state => applyFilters(state, options) })(store)
  // Setup Vue mixins methods for saveState and restoreState methods
  createMixin(store, options)
  // return store
}

export default persist
