<template>
    <div class="u-full-width">
        <transition-group tag="div" class="menu-bar u-full-width" name="slideLeft-fade">
            <button :key="1" v-on:click="$store.commit('toggleAddingDictionary')">
                <i class="material-icons">{{ addingDictionary ? 'close' : 'book' }}</i>{{ addingDictionary ? 'Abbrechen' : 'Wörterbuch hinzufügen' }}
            </button>
            <input :key="2" type="text" v-if="addingDictionary" v-model="newDictionary.lang1" @keyup.enter="addDictionary()" placeholder="Sprache 1" autofocus>
            <input :key="3" type="text" v-if="addingDictionary" v-model="newDictionary.lang2" @keyup.enter="addDictionary()" placeholder="Sprache 2">
            <button :key="4" v-if="addingDictionary" v-on:click="addDictionary()">
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
                <tr v-bind:class="{active: dictionary.id === activeDictionary}" v-on:click="$store.commit('setActiveDictionary', dictionary.id); $router.push('vocabularies')" :key="index" v-for="(dictionary, index) in dictionaries">
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
            addingDictionary: 'addingDictionary',
            newDictionary: 'newDictionary',
            activeDictionary: 'activeDictionary'
        }),
        ...mapGetters({
            dictionaries: 'dictionaries',
        })
    },
    methods: {
        ...mapActions({
            addDictionary: 'addDictionary'
        })
    }
}
</script>

<style>
.menu-bar {
    display: flex;
    flex-direction: row;
    margin-bottom: 1em;
}
th {
    height: 64px;
}
tbody tr.active {
    background: #ddd;
}
tbody tr:hover {
    background: #eee;
    cursor: pointer;
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
