import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        activeDictionary: 1,
        dictionaries: [
            {
                id: 1,
                lang1: 'Englisch',
                lang2: 'Deutsch',
                vocabularies: [
                    {
                        id: '0',
                        lang1: 'nice',
                        lang2: 'nett',
                        note: 'Ist meistens liebevoll gemeint',
                        category: 'Adjektive'
                    },
                    {
                        id: '1',
                        lang1: 'bad',
                        lang2: 'schlecht',
                        note: 'Ist meistens negativ gemeint',
                        category: 'Adjektive'
                    }
                ]
            },
            {
                id: 2,
                lang1: 'Spanisch',
                lang2: 'Deutsch',
                vocabularies: [
                    {
                        id: '0',
                        lang1: 'bueno',
                        lang2: 'gut',
                        note: 'Ist meistens positiv gemeint',
                        category: 'Adjektive'
                    },
                    {
                        id: '1',
                        lang1: 'noche',
                        lang2: 'nacht',
                        note: 'Kommt nach dem Abend',
                        category: 'Subjektive'
                    }
                ]
            }
        ],
        editing: false,
        newVocabulary: {
            lang1: '',
            lang2: '',
            note: '',
            category: ''
        }
    },

    getters: {
        dictionaries(state) {
            return state.dictionaries
        },
        activeDictionary(state) {
            return state.dictionaries.find(
                dictionary => dictionary.id === state.activeDictionary
            )
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
                        resolve()
                    } else {
                        alert('Das Wort ist bereits enthalten')
                    }
                } else {
                    alert('Das Wort enthält nicht alle erforderlichen Angaben.')
                }
            })
        }
    },

    mutations: {
        setActiveDictionary(state, dictionaryId) {
            state.activeDictionary = dictionaryId
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
        },
        emptyNewVocabulary(state) {
            Object.keys(state.newVocabulary).forEach(
                key => (state.newVocabulary[key] = '')
            )
        },
        toggleEditing(state) {
            state.editing = !state.editing
        }
    }
})
