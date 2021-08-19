import persist from './persist'
// ┌────────────────────────────────────────────────────────────────────┐
// │  vuex-persistedstate options can be customized inside options      │
// |  reducer option is preconfigured, customization will be discarded  │
// │  it is used to apply filters to the vuex state on mutation         │
// └────────────────────────────────────────────────────────────────────┘
// ┌────────────────────────────────────────────────────────────────────┐
// │ Filtering options can be used inside options to include            │
// │ and/or exclude paths from the presisted state                      │
// │ includePaths: ['a.b']    excludePaths: ['a.b.c']                   │
// └────────────────────────────────────────────────────────────────────┘
const options = {
  ...<%= JSON.stringify(options, null, 2) %>
}
// const sessionOpts = { ...options, namespace: 'storage2', storage: window.sessionStorage }
export default ({store}) => {
  persist(store, options)
  // persist(store, sessionOpts)
}
