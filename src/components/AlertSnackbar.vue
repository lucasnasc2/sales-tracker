<template>
    <v-snackbar :color="alertStore.color" theme="dark" v-model="alertStore.state">
        {{ alertStore.message }}
        <template v-slot:actions>
            <v-btn icon="mdi-close" @click="alertStore.closeAlert">
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { mapStores } from 'pinia';
import { useAlertStore } from '@/store/alerts';
export default {
    computed: {
        ...mapStores(useAlertStore)
    }
}
</script>