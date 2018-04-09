import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/dictionaries',
            name: 'dictionaries',
            component: require('@/components/DictionaryEditor').default
        },
        {
            path: '/vocabularies',
            name: 'vocabularies',
            component: require('@/components/VocabularyEditor').default
        },
        {
            path: '/boxes',
            name: 'boxes',
            component: require('@/components/BoxEditor').default
        },
        {
            path: '/learning',
            name: 'learning',
            component: require('@/components/Learning').default
        },
        {
            path: '*',
            redirect: '/dictionaries'
        }
    ]
})
