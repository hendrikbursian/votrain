import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = {
    activeDictionaryId: -1,
    dictionaries: [],
    addingVocabulary: false,
    addingDictionary: false,
    editingDictionary: false,
    editingVocabulary: false,
    filter: false,
    newVocabulary: {
        lang1: '',
        lang2: '',
        note: '',
        category: ''
    },
    newDictionary: {
        lang1: '',
        lang2: ''
    },
    query: {
        lang1: '',
        lang2: '',
        note: '',
        category: ''
    },

    ...JSON.parse(localStorage.getItem('store'))
}
saveState(store)

export default new Vuex.Store({
    state: store,
    strict: true,
    getters: {
        dictionaries(state) {
            return state.dictionaries
        },
        activeDictionary(state) {
            return state.dictionaries.find(
                dictionary => dictionary.id === state.activeDictionaryId
            )
        },
        filteredVocabularies(state, getters) {
            if (state.filter)
                return getters.activeDictionary.vocabularies.filter(voc => {
                    return (
                        voc.lang1.search(state.query.lang1) !== -1 &&
                        voc.lang2.search(state.query.lang2) !== -1 &&
                        voc.note.search(state.query.note) !== -1 &&
                        voc.category.search(state.query.category) !== -1
                    )
                })
            else return getters.activeDictionary.vocabularies
        }
    },

    actions: {
        toggleFilter({ commit }) {
            commit('toggleFilter')
        },
        toggleAddingDictionary({ commit, dispatch, state }) {
            let b = !state.addingDictionary
            dispatch('closeMenus')
            commit('setAddingDictionary', b)
        },
        toggleEditingDictionary({ commit, dispatch, state }) {
            let b = !state.editingDictionary
            dispatch('closeMenus')
            commit('setEditingDictionary', b)
        },
        toggleAddingVocabulary({ commit, dispatch, state }) {
            let b = !state.addingVocabulary
            dispatch('closeMenus')
            commit('setAddingVocabulary', b)
        },
        toggleEditingVocabulary({ commit, dispatch, state }) {
            let b = !state.editingVocabulary
            dispatch('closeMenus')
            commit('setEditingVocabulary', b)
        },
        closeMenus({ commit, state }) {
            commit('setAddingDictionary', false)
            commit('setEditingDictionary', false)
            commit('setAddingVocabulary', false)
            commit('setEditingVocabulary', false)
        },
        addVocabulary({ commit, dispatch, getters, state }) {
            return new Promise((resolve, reject) => {
                if (
                    state.newVocabulary.lang1 &&
                    state.newVocabulary.lang2 &&
                    state.newVocabulary.category
                ) {
                    if (
                        !getters.activeDictionary.vocabularies.find(
                            voc =>
                                voc.lang1 == state.newVocabulary.lang1 ||
                                voc.lang2 == state.newVocabulary.lang2
                        )
                    ) {
                        commit('addVocabularyToActiveDictionary')
                        commit('emptyNewVocabulary')
                        dispatch('toggleAddingVocabulary')
                        saveState(state)
                        resolve()
                    } else {
                        alert('Das Wort ist bereits enthalten')
                    }
                } else {
                    alert('Das Wort enthält nicht alle erforderlichen Angaben.')
                }
            })
        },
        addDictionary({ commit, getters, state }) {
            return new Promise((resolve, reject) => {
                if (state.newDictionary.lang1 && state.newDictionary.lang2) {
                    if (
                        !getters.dictionaries.find(
                            dic =>
                                dic.lang1 == state.newDictionary.lang1 &&
                                dic.lang2 == state.newDictionary.lang2
                        )
                    ) {
                        commit('addDictionary')
                        if (state.activeDictionary === -1)
                            commit('setActiveDictionaryId', 0)
                        commit('emptyNewDictionary')
                        commit('setAddingDictionary', false)
                        saveState(state)
                        resolve()
                    } else {
                        alert('Das Wörterbuch ist bereits enthalten')
                    }
                } else {
                    alert(
                        'Das Wörterbuch enthält nicht alle erforderlichen Angaben.'
                    )
                }
            })
        },
        setActiveDictionaryId({ commit, state }, dictionaryId) {
            commit('setActiveDictionaryId', dictionaryId)
            saveState(state)
        }
    },

    mutations: {
        setActiveDictionaryId(state, dictionaryId) {
            state.activeDictionaryId = dictionaryId
        },
        addDictionary(state) {
            state.dictionaries.push({
                id:
                    state.dictionaries.length > 0
                        ? state.dictionaries[state.dictionaries.length - 1].id +
                          1
                        : 0,
                lang1: state.newDictionary.lang1,
                lang2: state.newDictionary.lang2,
                vocabularies: []
            })
        },
        addVocabularyToActiveDictionary({ state, getters }) {
            getters.activeDictionary.vocabularies.push({
                lang1: state.newVocabulary.lang1,
                lang2: state.newVocabulary.lang2,
                note: state.newVocabulary.note,
                category: state.newVocabulary.category
            })
        },
        emptyNewDictionary(state) {
            Object.keys(state.newDictionary).forEach(
                key => (state.newDictionary[key] = '')
            )
        },
        emptyNewVocabulary(state) {
            Object.keys(state.newVocabulary).forEach(
                key => (state.newVocabulary[key] = '')
            )
        },
        setAddingVocabulary(state, payload) {
            state.addingVocabulary = payload
        },
        setAddingDictionary(state, payload) {
            state.addingDictionary = payload
        },
        setEditingDictionary(state, payload) {
            state.editingDictionary = payload
        },
        setEditingVocabulary(state, payload) {
            state.editingVocabulary = payload
        },
        toggleFilter(state) {
            state.filter = !state.filter
        }
    }
})

function saveState(state) {
    localStorage.setItem('store', JSON.stringify(state))
}
