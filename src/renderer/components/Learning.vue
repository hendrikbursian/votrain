<template>
    <div class="display-area learning">
        <div class="stack">
            <div  class="card"
                  v-bind:style="{transform: 'scale(' + (1.02 - ((vocabulariesForBox(activeBoxId).length-index) * 0.02)) + ')'}"
                  :key="voc.id"
                  v-for="(voc, index) in vocabulariesForBox(activeBoxId)"
            >{{ voc.lang1 }}</div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
            activeBoxId: 'activeBoxId'
        }),
        ...mapGetters({
            vocabulariesForBox: 'vocabulariesForBox'
        })
    },
    methods: {
        ...mapActions({})
    },
    beforeMount() {
        Mousetrap.bind('b', () => this.toggleEditingDictionary())
    }
}
</script>

<style>
.learning {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.stack {
    margin: 20px auto;
    width: 400px;
    padding: 0;
    position: relative;
    max-width: 100%;
}

.stack .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 28em;
    height: 18em;
    position: absolute;
    top: 0;
    left: 0;
    background: #eee;
    transition: all 0.33s ease;
    backface-visibility: hidden;
    transform-origin: 50% -50%;
    box-shadow: 0px -1px 3px -2px #333;
}
</style>
