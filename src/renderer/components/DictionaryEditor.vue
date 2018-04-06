<template>
    <div class="u-full-width">
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-on:click="$store.commit('toggleEdit')">
                <i class="material-icons">{{ edit ? 'close' : 'book' }}</i>{{ edit ? 'Abbrechen' : 'Wörterbuch hinzufügen' }}
            </button>
            <input :key="2" type="text" v-if="edit" v-model="newDictionary.lang1" @keyup.enter="addDictionary(); $store.commit('toggleEdit')" placeholder="Sprache 1" autofocus>
            <input :key="3" type="text" v-if="edit" v-model="newDictionary.lang2" @keyup.enter="addDictionary(); $store.commit('toggleEdit')" placeholder="Sprache 2">
            <button :key="4" v-if="edit" v-on:click="addDictionary(); $store.commit('toggleEdit')">
                <i class="material-icons">save</i> Speichern
            </button>
        </transition-group>
        <table class="u-full-width">
            <thead>
                <tr>
                    <th style="width:25%">Sprache 1</th>
                    <th style="width:25%">Sprache 2</th>
                    <th style="width:25%">Vokabeln</th>
                </tr>
            </thead>
            <tbody>
                <tr v-on:click="$store.commit('setActiveDictionary', dictionary.id); $router.push('vocabularies')" :key="index" v-for="(dictionary, index) in dictionaries">
                    <td>{{ dictionary.lang1 }}</td>
                    <td>{{ dictionary.lang2 }}</td>
                    <td>{{ dictionary.vocabularies.length }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
            edit: 'edit',
            newDictionary: 'newDictionary'
        }),
        ...mapGetters({
            dictionaries: 'dictionaries'
        })
    },
    methods: {
        ...mapActions({
            addDictionary: 'addDictionary'
        })
    }

}
</script>

<style scoped>
button,
.button {
    cursor: pointer;
    margin-bottom: 1rem;
    outline: 0;
    height: 2.5em;
    white-space: nowrap;
}

.menu-bar {
    display: flex;
    flex-direction: row;
    margin-bottom: 1em;
}
th {
    height: 64px;
}
tbody tr:hover {
    background: #efefef;
    cursor: pointer;
}
button,
input {
    display: inline-flex;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    padding: 0 8px 0 2px;
    margin: 0 8px 0 0;
    border: 1px solid transparent;
    border-bottom: 1px solid #888;
    transition: all 1s ease;
}

.menu-bar input {
    width: 20%;
}

.menu-bar :last-child {
    margin-right: 0;
}

button i {
    margin-right: 8px;
}

button:hover,
input:hover {
    border-bottom-color: #333;
}

button:focus,
input:focus {
    border: 1px solid transparent;
    border-bottom: 1px solid #333;
}

.slideLeft-fade-enter-active,
.slideLeft-fade-leave-active {
    transition: all 0.33s ease;
}

.slideLeft-fade-enter,
.slideLeft-fade-leave-to {
    transform: translateX(-45px);
    opacity: 0;
}
</style>
