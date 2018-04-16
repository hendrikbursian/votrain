import Vue from 'vue'
import Router from 'vue-router'

import store from '../../store/index'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/dictionaries',
            name: 'dictionaries',
            component: require('@/components/DictionaryEditor').default
        },
        {
            path: '/categories',
            name: 'categories',
            component: require('@/components/CategoryEditor').default
        },
        {
            path: '/vocabularies',
            name: 'vocabularies',
            component: require('@/components/VocabularyEditor').default,
            beforeEnter: (to, from, next) => {
                if (store.state.activeDictionaryId === -1) {
                    alert(
                        'Bevor du Vokabeln anzeigen kannst brauchst du ein Wörterbuch. Lege eins im entsprechenden Reiter an und leg los!'
                    )
                    next(false)
                } else {
                    next()
                }
            }
        },
        {
            path: '/boxes',
            name: 'boxes',
            component: require('@/components/BoxEditor').default
        },
        {
            path: '/learning',
            name: 'learning',
            component: require('@/components/Learning').default,
            beforeEnter: (to, from, next) => {
                if (
                    store.state.activeDictionaryId === -1 ||
                    store.getters.activeDictionary.vocabularies.length === 0 ||
                    store.state.boxes.length === 0
                ) {
                    alert(
                        'Bevor du lernen kannst brauchst du ein Wörterbuch mit Vokabeln und Karteikästen. Lege sie in den entsprechenden Reitern an und leg los!'
                    )
                    next(false)
                } else {
                    next()
                }
            }
        },
        {
            path: '/help',
            name: 'help',
            component: require('@/components/Help').default
        },
        {
            path: '*',
            redirect: '/dictionaries'
        }
    ]
})
