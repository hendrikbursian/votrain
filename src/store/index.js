import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = {
    activeDictionaryId: -1,
    dictionaries: [],
    boxes: [],
    addingVocabulary: false,
    addingDictionary: false,
    editingDictionary: false,
    editingVocabulary: false,

    ...JSON.parse(localStorage.getItem('store'))
}

export default new Vuex.Store({
    state: store,
    getters: {
        activeDictionary(state) {
            return state.dictionaries.find(
                dictionary => dictionary.id === state.activeDictionaryId
            )
        }
    },

    actions: {
        toggleAddingDictionary({ commit, dispatch, state }) {
            let b = !state.addingDictionary
            dispatch('closeMenus')
            commit('SET_ADDING_DICTIONARY', b)
        },
        toggleEditingDictionary({ commit, dispatch, state }) {
            let b = !state.editingDictionary
            dispatch('closeMenus')
            commit('SET_EDITIING_DICTIONARY', b)
        },
        toggleAddingVocabulary({ commit, dispatch, state }) {
            let b = !state.addingVocabulary
            dispatch('closeMenus')
            commit('SET_ADDING_VOCABULARY', b)
        },
        toggleEditingVocabulary({ commit, dispatch, state }) {
            let b = !state.editingVocabulary
            dispatch('closeMenus')
            commit('SET_EDITING_VOCABULARY', b)
        },
        closeMenus({ commit, state }) {
            commit('SET_ADDING_DICTIONARY', false)
            commit('SET_EDITIING_DICTIONARY', false)
            commit('SET_ADDING_VOCABULARY', false)
            commit('SET_EDITING_VOCABULARY', false)
        },
        addVocabulary({ commit, dispatch, getters, state }, vocabulary) {
            return new Promise((resolve, reject) => {
                if (
                    vocabulary.lang1 &&
                    vocabulary.lang2 &&
                    vocabulary.category
                ) {
                    if (
                        !getters.activeDictionary.vocabularies.find(
                            voc =>
                                voc.lang1 == vocabulary.lang1 ||
                                voc.lang2 == vocabulary.lang2
                        )
                    ) {
                        getters.activeDictionary.vocabularies.push({
                            lang1: vocabulary.lang1,
                            lang2: vocabulary.lang2,
                            note: vocabulary.note,
                            category: vocabulary.category
                        })

                        dispatch('toggleAddingVocabulary')
                        dispatch('saveState')
                        resolve()
                    } else {
                        reject('Das Wort ist bereits enthalten')
                    }
                } else {
                    reject('Das Wort enthält nicht alle erforderlichen Angaben.')
                }
            })
        },
        addDictionary({ commit, dispatch, getters, state }, dictionary) {
            return new Promise((resolve, reject) => {
                if (dictionary.lang1 && dictionary.lang2) {
                    if (
                        !getters.dictionaries.find(
                            dic =>
                                dic.lang1 == dictionary.lang1 &&
                                dic.lang2 == dictionary.lang2
                        )
                    ) {
                        commit('ADD_DICTIONARY', dictionary)
                        if (state.activeDictionaryId === -1)
                            commit('SET_ACTIVE_DICTIONARY_ID', 0)
                        commit('SET_ADDING_DICTIONARY', false)
                        dispatch('saveState')
                        resolve()
                    } else {
                        reject('Das Wörterbuch ist bereits enthalten')
                    }
                } else {
                    reject(
                        'Das Wörterbuch enthält nicht alle erforderlichen Angaben.'
                    )
                }
            })
        },
        setActiveDictionaryId({ commit, dispatch, state }, dictionaryId) {
            commit('SET_ACTIVE_DICTIONARY_ID', dictionaryId)
            dispatch('saveState')
        },
        saveState({ state }) {
            localStorage.setItem('store', JSON.stringify(state))
        }
    },

    mutations: {
        SET_ACTIVE_DICTIONARY_ID(state, dictionaryId) {
            state.activeDictionaryId = dictionaryId
        },
        ADD_DICTIONARY(state, dictionary) {
            state.dictionaries.push({
                id:
                    state.dictionaries.length > 0
                        ? state.dictionaries[state.dictionaries.length - 1].id +
                          1
                        : 0,
                lang1: dictionary.lang1,
                lang2: dictionary.lang2,
                vocabularies: []
            })
        },
        SET_ADDING_VOCABULARY(state, payload) {
            state.addingVocabulary = payload
        },
        SET_ADDING_DICTIONARY(state, payload) {
            state.addingDictionary = payload
        },
        SET_EDITIING_DICTIONARY(state, payload) {
            state.editingDictionary = payload
        },
        SET_EDITING_VOCABULARY(state, payload) {
            state.editingVocabulary = payload
        }
    }
})
