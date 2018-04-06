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
        edit: false,
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
    },

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
                        commit('toggleEdit')
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
                        commit('emptyNewDictionary')
                        resolve()
                    } else {
                        alert('Das Wörterbuch ist bereits enthalten')
                    }
                } else {
                    alert('Das Wörterbuch enthält nicht alle erforderlichen Angaben.')
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
                id: state.dictionaries[state.dictionaries.length-1].id + 1,
                lang1: state.newDictionary.lang1,
                lang2: state.newDictionary.lang2,
                vocabularies: []
            })
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
        toggleEdit(state) {
            state.edit = !state.edit
        },
        toggleSearch(state) {
            state.search = !state.search
        }
    }
})
