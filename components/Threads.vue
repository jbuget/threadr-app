<script setup lang="ts">

const { data: threads } = await useFetch('/api/threads')

</script>

<template>
    <div class="threads">
        <div class="thread" v-for="(thread, index) in threads">
            {{ thread.id }}<br>
            {{ thread.createdAt }}<br>
            {{ thread.updatedAt }}<br>
            {{ thread.published }}<br>
        </div>
    </div>
</template>