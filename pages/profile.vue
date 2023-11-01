<script setup lang="ts">
const user = ref({ fullname: 'Jean Dupont' })
</script>

<template>
    <div>
        👋 Welcome back, <strong>{{ user.fullname }}</strong>!
    </div>
</template>

