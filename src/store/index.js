import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultState = {
    activeDictionaryId: -1,
    activeBoxId: -1,
    dictionaries: [],
    categories: {},
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
        activeDictionary: state =>
            state.dictionaries.find(
                dictionary => dictionary.id === state.activeDictionaryId
            ),
        activeBox: state =>
            state.boxes.find(box => box.id === state.activeBoxId),
        vocabulariesForBox: (state, getters) => boxId => {
            let date = Date.now()
            let box = state.boxes.find(box => box.id === boxId)
            return getters.activeDictionary.vocabularies.filter(voc => {
                return (
                    (box.category ? box.category === voc.category : true) &&
                    (box.minAge
                        ? box.minAge * 1000 * 60 * 60 * 24 <
                          date - Date.parse(voc.lastSeen)
                        : true) &&
                    (box.ratio > 0
                        ? box.ratio <
                          (1 - voc.correctCount / voc.seenCount) * 100
                        : true)
                )
            })
        },
        vocabularyCountInCategory: state => categoryId => {
            let count = 0
            state.dictionaries.forEach(
                dic =>
                    (count += dic.vocabularies.filter(
                        voc => voc.categoryId === categoryId
                    ).length)
            )
            return count
        },
        categoryName: state => categoryId => {
            return state.categories[categoryId]
        },
        categoryId: state => categoryName => {
            let id = Object.keys(state.categories).find(
                id =>
                    state.categories[id].toLowerCase() ===
                    categoryName.toLowerCase()
            )
            return id ? id : -1
        }
    },

    actions: {
        seenVocabulary({ commit, getters }, data) {
            return new Promise((resolve, reject) => {
                getters.activeDictionary.vocabularies.find(
                    voc => voc.id === data.vocabularyId
                )
                commit('VOCABULARY_SEEN', data.vocabularyId)

                if (data.isCorrect)
                    commit(
                        'INCREASE_VOCABULARY_CORRECT_COUNT',
                        data.vocabularyId
                    )
                resolve()
            })
        },
        setActiveBoxId({ commit, dispatch }, boxId) {
            return new Promise(resolve => {
                commit('SET_ACTIVE_BOX_ID', boxId)
                resolve()
            })
        },
        setActiveDictionaryId({ commit, dispatch }, dictionaryId) {
            return new Promise(resolve => {
                commit('SET_ACTIVE_DICTIONARY_ID', dictionaryId)
                resolve()
            })
        },
        setCategories({ commit }, categories) {
            return new Promise((resolve, reject) => {
                let duplicates = []
                Object.values(categories).forEach((cat, index, arr) => {
                    if (!cat)
                        return reject(
                            'Es sind nicht alle erforderlichen Angaben enthalten.'
                        )
                    if (arr.lastIndexOf(cat) !== index) duplicates.push(cat)
                })

                if (duplicates.length > 0)
                    reject(
                        `Folgende Kategorien sind doppelt. Bitte pass sie an\n\n${duplicates
                            .map(dup => `--> ${dup}`)
                            .join('\n')}`
                    )

                commit('SET_CATEGORIES', categories)
                resolve()
            })
        },
        setDictionaries({ commit }, dictionaries) {
            return new Promise((resolve, reject) => {
                if (dictionaries.find(dic => !dic.lang1 || !dic1.lang2))
                    return reject(
                        'Die Wörterbücher enthalten nicht alle erforderlichen Angaben.'
                    )

                let duplicates = dictionaries.filter(dic1 => {
                    return (
                        dictionaries.find(
                            dic2 =>
                                (dic1.id !== dic2.id &&
                                    (dic1.lang1 === dic2.lang1 &&
                                        dic1.lang2 === dic2.lang2)) ||
                                (dic1.lang1 === dic2.lang2 &&
                                    dic1.lang2 === dic2.lang1)
                        ) !== undefined
                    )
                })

                if (duplicates.length > 0)
                    return reject(
                        `Folgende Wörterbücher sind doppelt. Bitte pass sie an\n\n${duplicates
                            .map(dup => `--> ${dup.lang1} / ${dup.lang2}`)
                            .join('\n')}`
                    )

                commit('SET_DICTIONARIES', dictionaries)
                resolve()
            })
        },
        setVocabularies({ commit, dispatch, getters, state }, vocabularies) {
            return new Promise((resolve, reject) => {
                if (
                    vocabularies.find(
                        voc => !voc.lang1 || !voc.lang2 || !voc.category
                    )
                )
                    return reject(
                        'Die Vokabeln enthalten nicht alle erforderlichen Angaben.'
                    )

                let duplicates = vocabularies.filter(voc1 => {
                    return (
                        vocabularies.find(
                            voc2 =>
                                voc1.id !== voc2.id &&
                                (voc1.lang1 === voc2.lang1 &&
                                    voc1.lang2 === voc2.lang2)
                        ) !== undefined
                    )
                })

                if (duplicates.length > 0)
                    return reject(
                        `Folgende Vokabeln sind doppelt. Bitte pass sie an\n\n${duplicates
                            .map(dup => `--> ${dup.lang1} / ${dup.lang2}`)
                            .join('\n')}`
                    )

                let promises = []
                let categories = Object.values(state.categories).map(cat =>
                    cat.toLowerCase()
                )

                vocabularies.forEach(voc => {
                    if (!categories.includes(voc.category.toLowerCase())) {
                        categories.push(voc.category.toLowerCase())
                        promises.push(dispatch('addCategory', voc.category))
                    }
                })

                return Promise.all(promises)
                    .then(() => {
                        commit(
                            'SET_VOCABULARIES_FOR_ACTIVE_DICTIONARY',
                            vocabularies.map(voc => {
                                return {
                                    id: voc.id,
                                    lang1: voc.lang1,
                                    lang2: voc.lang2,
                                    note: voc.note,
                                    categoryId: getters.categoryId(voc.category)
                                }
                            })
                        )
                    })
                    .then(resolve)
            })
        },
        addBox({ commit, dispatch, getters, state }, box) {
            return new Promise((resolve, reject) => {
                box.categoryId = getters.categoryId(box.category)
                if (box.categoryId === -1) {
                    commit('ADD_CATEGORY', box.category)
                    box.categoryId = getters.categoryId(box.category)
                }

                if (
                    !state.boxes.find(
                        b =>
                            b.minAge === box.minAge &&
                            b.categoryId === box.categoryId &&
                            b.ratio === box.ratio &&
                            b.limit === box.limit
                    )
                ) {
                    commit('ADD_BOX', box)
                    dispatch('saveState')
                    resolve()
                } else {
                    reject('Der Karteikasten ist bereits enthalten.')
                }
            })
        },
        addCategory({ state, commit, getters }, categoryName) {
            return new Promise((resolve, reject) => {
                if (
                    Object.values(state.categories).find(
                        cat => cat === categoryName
                    )
                )
                    return reject('Die Kategorie ist bereits enthalten.')

                commit('ADD_CATEGORY', categoryName)
                resolve(getters.categoryId(categoryName))
            })
        },
        addDictionary({ commit, dispatch, state }, dictionary) {
            return new Promise((resolve, reject) => {
                if (dictionary.lang1 && dictionary.lang2) {
                    if (
                        !state.dictionaries.find(
                            dic =>
                                (dic.lang1 === dictionary.lang1 &&
                                    dic.lang2 === dictionary.lang2) ||
                                (dic.lang1 === dictionary.lang2 &&
                                    dic.lang2 === dictionary.lang1)
                        )
                    ) {
                        commit('ADD_DICTIONARY', dictionary)
                        if (state.activeDictionaryId === -1)
                            commit('SET_ACTIVE_DICTIONARY_ID', 0)
                        dispatch('saveState')
                        resolve()
                    } else {
                        reject('Das Wörterbuch ist bereits enthalten.')
                    }
                } else {
                    reject(
                        'Das Wörterbuch enthält nicht alle erforderlichen Angaben.'
                    )
                }
            })
        },
        addVocabulary({ commit, dispatch, getters, state }, vocabulary) {
            return new Promise((resolve, reject) => {
                if (
                    !vocabulary.lang1 ||
                    !vocabulary.lang2 ||
                    !vocabulary.category
                )
                    return reject(
                        'Die Vokabel enthält nicht alle erforderlichen Angaben.'
                    )

                if (
                    getters.activeDictionary.vocabularies.find(
                        voc =>
                            voc.lang1 === vocabulary.lang1 &&
                            voc.lang2 === vocabulary.lang2
                    )
                )
                    return reject('Die Vokabel ist bereits enthalten.')

                vocabulary.categoryId = getters.categoryId(vocabulary.category)
                if (vocabulary.categoryId === -1) {
                    return dispatch('addCategory', vocabulary.category)
                        .then(categoryId => {
                            vocabulary.categoryId = categoryId
                            commit(
                                'ADD_VOCABULARY_TO_ACTIVE_DICTIONARY',
                                vocabulary
                            )
                        })
                        .then(dispatch('saveState'))
                        .then(resolve)
                        .catch(reject)
                } else {
                    commit('ADD_VOCABULARY_TO_ACTIVE_DICTIONARY', vocabulary)
                    dispatch('saveState')
                    resolve()
                }
            })
        },
        deleteBox({ commit }, boxId) {
            return new Promise(resolve => {
                commit('DELETE_BOX', boxId)
                resolve()
            })
        },
        deleteCategory({ commit, getters }, categoryId) {
            return new Promise((resolve, reject) => {
                if (getters.vocabularyCountInCategory(categoryId) > 0)
                    return reject(
                        'Die Kategorie muss leer sein, bevor sie gelöscht wird. Entferne die entsprechenden Vokabeln, um sie zu löschen.'
                    )

                commit('DELETE_CATEGORY', categoryId)
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
        deleteVocabulary({ commit }, vocabularyId) {
            return new Promise(resolve => {
                commit('DELETE_VOCABULARY_FROM_ACTIVE_DICTIONARY', vocabularyId)
                resolve()
            })
        },
        saveState({ state }) {
            return new Promise(resolve => {
                localStorage.setItem('store', JSON.stringify(state))
                resolve()
            })
        },
        loadState({ commit, state }) {
            return new Promise(resolve => {
                commit('SET_STATE', getLocalState())
                resolve()
            })
        }
    },

    mutations: {
        VOCABULARY_SEEN(state, vocabularyId) {
            let activeDictionary = state.dictionaries.find(
                dic => dic.id === state.activeDictionaryId
            )
            let voc = activeDictionary.vocabularies.find(
                voc => voc.id === vocabularyId
            )
            voc.seenCount++
            voc.lastSeen = new Date()
        },
        INCREASE_VOCABULARY_CORRECT_COUNT(state, vocabularyId) {
            let activeDictionary = state.dictionaries.find(
                dic => dic.id === state.activeDictionaryId
            )
            let voc = activeDictionary.vocabularies.find(
                voc => voc.id === vocabularyId
            )
            voc.correctCount++
        },
        SET_ACTIVE_DICTIONARY_ID(state, dictionaryId) {
            state.activeDictionaryId = dictionaryId
        },
        SET_ACTIVE_BOX_ID(state, boxId) {
            state.activeBoxId = boxId
        },
        SET_CATEGORIES(state, categories) {
            state.categories = categories
        },
        SET_DICTIONARIES(state, dictionaries) {
            state.dictionaries = dictionaries
        },
        SET_STATE(state, stateUpdate) {
            Object.keys(defaultState).forEach(
                key => (state[key] = stateUpdate[key])
            )
        },
        SET_VOCABULARIES_FOR_ACTIVE_DICTIONARY(state, vocabularies) {
            let activeDictionary = state.dictionaries.find(
                dic => dic.id === state.activeDictionaryId
            )
            activeDictionary.vocabularies = vocabularies
        },
        ADD_BOX(state, box) {
            state.boxes.push({
                id: generateId(state.boxes),
                minAge: box.minAge,
                categoryId: box.categoryId,
                ratio: box.ratio,
                limit: box.limit
            })
        },
        ADD_CATEGORY(state, categoryName) {
            state.categories[generateId(state.categories)] = categoryName
        },
        ADD_DICTIONARY(state, dictionary) {
            state.dictionaries.push({
                id: generateId(state.dictionaries),
                lang1: dictionary.lang1,
                lang2: dictionary.lang2,
                vocabularies: []
            })
        },
        ADD_VOCABULARY_TO_ACTIVE_DICTIONARY(state, vocabulary) {
            let activeDictionary = state.dictionaries.find(
                dic => dic.id === state.activeDictionaryId
            )
            activeDictionary.vocabularies.push({
                id: generateId(activeDictionary.vocabularies),
                lang1: vocabulary.lang1,
                lang2: vocabulary.lang2,
                note: vocabulary.note,
                categoryId: vocabulary.categoryId,
                seenCount: 0,
                correctCount: 0,
                lastSeen: new Date(0)
            })
        },
        DELETE_BOX(state, boxId) {
            state.boxes = state.boxes.filter(box => box.id !== boxId)
        },
        DELETE_CATEGORY(state, categoryId) {
            let categories = {}
            Object.keys(state.categories).forEach(key => {
                if (key !== categoryId) categories[key] = state.categories[key]
            })
            state.categories = categories
        },
        DELETE_DICTIONARY(state, dictionaryId) {
            state.dictionaries = state.dictionaries.filter(
                dic => dic.id !== dictionaryId
            )
        },
        DELETE_VOCABULARY_FROM_ACTIVE_DICTIONARY(state, vocabularyId) {
            let dic = state.dictionaries.find(
                dic => dic.id === state.activeDictionaryId
            )
            dic.vocabularies = dic.vocabularies.filter(
                voc => voc.id !== vocabularyId
            )
        }
    }
})

function generateId(item) {
    if (item instanceof Array)
        return item.length > 0 ? item[item.length - 1].id + 1 : 0
    if (item instanceof Object) {
        let ids = Object.keys(item)
        return ids.length > 0 ? parseInt(ids.slice(-1)) + 1 : 0
    }
}
