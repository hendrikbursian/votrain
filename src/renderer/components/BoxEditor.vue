<template>
    <div class="u-full-width">
        
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
        }),
        ...mapGetters({
        })
    },
    methods: {
        ...mapActions({
        })
    },
    beforeMount() {
        Mousetrap.bind('b', () => this.toggleEditingDictionary())
    }
}
</script>