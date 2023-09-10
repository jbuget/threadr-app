<script setup lang="ts">

const selectThread = (threadId: number) => {
    console.log(`Clicked item ${threadId}`)
    emit('threadSelected', threadId);
}

const props = defineProps<{
    threads: any
}>()

const emit = defineEmits<{
    threadSelected: [id: number]
}>()
</script>

<template>
    <div class="threads">
        <div class="thread" v-for="(thread) in threads" @click="selectThread(thread.id)">
            {{ thread.id }}<br>
            {{ thread.createdAt }}<br>
            {{ thread.updatedAt }}<br>
            {{ thread.published }}<br>
        </div>
    </div>
</template>

<style>
.thread {
    cursor: pointer;
    margin: 5px;
}
</style>