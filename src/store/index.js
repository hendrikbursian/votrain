import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = {
    activeDictionaryId: -1,
    dictionaries: [],
    boxes: [],

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
                        commit(
                            'ADD_VOCABULARY_TO_ACTIVE_DICTIONARY',
                            vocabulary
                        )
                        dispatch('saveState')
                        resolve()
                    } else {
                        reject('Das Wort ist bereits enthalten')
                    }
                } else {
                    reject(
                        'Das Wort enthält nicht alle erforderlichen Angaben.'
                    )
                }
            })
        },
        addDictionary({ commit, dispatch, state }, dictionary) {
            return new Promise((resolve, reject) => {
                if (dictionary.lang1 && dictionary.lang2) {
                    if (
                        !state.dictionaries.find(
                            dic =>
                                dic.lang1 == dictionary.lang1 &&
                                dic.lang2 == dictionary.lang2
                        )
                    ) {
                        commit('ADD_DICTIONARY', dictionary)
                        if (state.activeDictionaryId === -1)
                            commit('SET_ACTIVE_DICTIONARY_ID', 0)
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
        ADD_VOCABULARY_TO_ACTIVE_DICTIONARY(state, vocabulary) {
            state.dictionaries
                .find(dic => dic.id === state.activeDictionaryId)
                .vocabularies.push({
                    lang1: vocabulary.lang1,
                    lang2: vocabulary.lang2,
                    note: vocabulary.note,
                    category: vocabulary.category
                })
        }
    }
})
