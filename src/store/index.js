import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultState = {
    activeDictionaryId: -1,
    dictionaries: [],
    boxes: []
}

function getLocalState() {
    return {
        ...defaultState,
        ...JSON.parse(localStorage.getItem('store'))
    }
}

export default new Vuex.Store({
    state: getLocalState(),
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
        setActiveDictionaryId({ commit, dispatch }, dictionaryId) {
            return new Promise(resolve => {
                commit('SET_ACTIVE_DICTIONARY_ID', dictionaryId)
                resolve()
            })
        },
        deleteDictionary({ commit, state }, dictionaryId) {
            return new Promise(resolve => {
                if (state.activeDictionaryId === dictionaryId) {
                    if (state.dictionaries.length === 1) {
                        commit('SET_ACTIVE_DICTIONARY_ID', -1)
                    } else {
                        if (state.dictionaries[0].id === dictionaryId)
                            commit(
                                'SET_ACTIVE_DICTIONARY_ID',
                                state.dictionaries[1].id
                            )
                        else
                            commit(
                                'SET_ACTIVE_DICTIONARY_ID',
                                state.dictionaries[0].id
                            )
                    }
                }
                commit('DELETE_DICTIONARY', dictionaryId)
                resolve()
            })
        },
        saveState({ state }) {
            return new Promise(resolve => {
                localStorage.setItem('store', JSON.stringify(state))
                resolve()
            })
        },
        loadState({ state, commit }) {
            return new Promise(resolve => {
                commit('UPDATE_STATE', getLocalState())
                resolve()
            })
        }
    },

    mutations: {
        UPDATE_STATE(state, stateUpdate) {
            Object.keys(defaultState).forEach(
                key => (state[key] = stateUpdate[key])
            )
        },
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
        DELETE_DICTIONARY(state, dictionaryId) {
            state.dictionaries = state.dictionaries.filter(function(dic) {
                return dic.id !== dictionaryId
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
