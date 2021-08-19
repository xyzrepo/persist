import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { forEach, isEmpty, merge, omit, pick, keys } from 'lodash'
// process.env.DEBUG = true
const log = (...msg) => (process.env.DEBUG ? console.debug(...msg) : undefined)
const Store = Vuex.Store
const isObject = obj => typeof obj === 'object'
const sanitizeObject = (data, deep = true, filterExpression = key => key[0] !== '_') =>
  Object.keys(data)
    .filter(filterExpression)
    .reduce((obj, key) => {
      obj[key] =
        deep && isObject(data[key])
          ? sanitizeObject(data[key], filterExpression)
          : data[key]
      return obj
    }, {})
const namespaced = (arr, options) =>
  typeof options === 'object'
    ? arr.map(entry => `${options.namespace}.${entry}`)
    : arr.map(entry => `${options}.${entry}`)
const applyFilters = (data, options) => {
  const { includePaths, excludePaths } = options
  let result = sanitizeObject(data, true)
  result = !isEmpty(excludePaths)
    ? omit(result, namespaced(excludePaths, options))
    : result
  result = !isEmpty(includePaths)
    ? pick(result, namespaced(includePaths, options))
    : result
  return result
}
// const RESTORE_STATE = (state, target) => {
//   if (isNil(state) || isEmpty(state)) {
//     // console.log('restoreState error, state does not exists', state, target);
//     return
//   }
//   if (isNil(target)) {
//     // console.log('restoreState error, target does not exists', state, target);
//     const vm = new Vue()
//     target = vm.$data
//   }
//   // console.log('RESTORE_STATE executed', state, target);
//   const savedState = merge({}, target, state)
//   forEach(savedState, (value, key) => {
//     target[key] = value
//   })
// }
// const SET_STATE = (state, newState) => merge(state, newState)
// const RESET_STATE = state => forEach(keys(state), key => delete state[key])

const useVuexStore = (store) => {
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
const useVuexStoreModule = (store, options) => {
  const { namespace } = options
  store = useVuexStore(store)
  store.registerModule(namespace, {
    namespaced: true,
    mutations: {
      restore: (state, target) =>
        forEach(merge({}, target, state), (value, key) => { target[key] = value }),
      save: (state, newState) => merge(state, newState),
      reset: state => forEach(keys(state), key => delete state[key])
    },
    actions: {
      saveState: ({ commit }, payload) => commit('save', payload),
      restoreState: ({ commit }, payload) => commit('restore', payload),
      resetState: ({ commit }, payload) => commit('reset', payload)
      // nuxtServerInit: ({ commit }, context) => commit('restore', context),
    }
  })
  // console.log('store module created', store);
  return store
}
const usePersistWatcherMixin = (store, options) => {
  const { namespace } = options
  log('[Persist :: Watcher Enabled]')
  Vue.mixin({
    watch: {
      $data: {
        handler () {
          const persistEnabled = this.$options.persist
          if (persistEnabled) {
            store.dispatch(namespace + '/saveState', this.$data)
            log('[Persist :: State Saved]', this.$route.name)
            // this.saveState()
          }
        },
        deep: true
      }
    },
    mounted () {
      const persistEnabled = this.$options.persist
      if (persistEnabled) {
        store.dispatch(namespace + '/restoreState', this.$data)
        log('[Persist :: State Restored]', this.$route.name)
        // this.restoreState()
      }
    }
  })
}
const usePersistMethodsMixin = (store, options) => {
  const { namespace } = options
  log('[Persist Methods Enabled]')
  Vue.mixin({
    methods: {
      saveState (source = this.$data) {
        source = this.$data
        store.dispatch(namespace + '/saveState', source)
      },
      restoreState (target = this.$data) {
        target = this.$data
        store.dispatch(namespace + '/restoreState', target)
      },
      resetState: () => store.dispatch(`${namespace}/resetState`, namespace)
    }
  })
}
const useVuexPersistedStatePlugin = (store, options) => createPersistedState({
  key: 'storage',
  namespace: 'state',
  ...options,
  reducer: state => applyFilters(state, options)
})(store)
const useMixins = (store, options) => {
  // log('mixin created', store);
  usePersistWatcherMixin(store, options)
  usePersistMethodsMixin(store, options)
}
const persist = (store, options) => {
  // Setup Vuex store module to handle persisted state
  const storeModule = useVuexStoreModule(store, options)
  // Setup Vuex Persisted State Plugin
  useVuexPersistedStatePlugin(storeModule, options)
  // Setup Vue mixins methods for saveState and restoreState methods
  useMixins(storeModule, options)
}

export default persist
