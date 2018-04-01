import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        dictionaries: [],
        dictionary: {
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
        }
    },

    getters: {},

    actions: {
        fetchVocabularies() {}
    },

    mutations: {
        addDictionary(state, dictionary) {},

        addVocabulory(state, vocabulory) {}
    }
})
