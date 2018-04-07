import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var store = JSON.parse(localStorage.getItem('store'))

if (!store) {
    store = {
        activeDictionary: -1,
        dictionaries: [],
        addingVocabulary: false,
        addingDictionary: false,
        search: false,
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
        }
    }
    saveState(store)
}

export default new Vuex.Store({
    state: store,
    getters: {
        dictionaries(state) {
            return state.dictionaries
        },
        activeDictionary(state) {
            return state.dictionaries.find(
                dictionary => dictionary.id === state.activeDictionary
            )
        },
        filteredVocabularies(state, getters) {
            if (state.search)
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
        addVocabulary({ commit, getters, state }) {
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
                        commit('toggleAddingVocabulary')
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
                            commit('setActiveDictionary', 0)
                        commit('emptyNewDictionary')
                        commit('toggleAddingDictionary')
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
        }
    },

    mutations: {
        setActiveDictionary(state, dictionaryId) {
            state.activeDictionary = dictionaryId
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
            saveState(state)
        },
        addVocabularyToActiveDictionary(state) {
            state.dictionaries
                .find(dictionary => dictionary.id === state.activeDictionary)
                .vocabularies.push({
                    lang1: state.newVocabulary.lang1,
                    lang2: state.newVocabulary.lang2,
                    note: state.newVocabulary.note,
                    category: state.newVocabulary.category
                })
            saveState(state)
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
        toggleAddingVocabulary(state) {
            state.addingVocabulary = !state.addingVocabulary
        },
        toggleAddingDictionary(state) {
            state.addingDictionary = !state.addingDictionary
        },
        toggleSearch(state) {
            state.search = !state.search
        }
    }
})

function saveState(state) {
    localStorage.setItem('store', JSON.stringify(state))
}
