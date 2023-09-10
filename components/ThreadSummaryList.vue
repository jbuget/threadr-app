<script setup lang="ts">

const selectThread = (threadId: number) => {
    console.log(`Clicked item ${threadId}`)
    emit('threadSelected', threadId);
}

const { data: threads } = await useFetch(
    '/api/threads', {
    transform: (input: any) => {
        const threads = input.map((threadData: any) => ({
            id: threadData.id,
            createdAt: threadData.createdAt,
            updatedAt: threadData.updatedAt,
            published: threadData.published,
            nbMessages: threadData.nbMessages
        }))
        return threads
    }
})

const emit = defineEmits<{
    threadSelected: [id: number]
}>()
</script>

<template>
    <div class="threads" v-if="threads">
        <div class="thread" v-for="(thread) in threads" @click="selectThread(thread.id)">
            <span class="thread-title">Thread #{{ thread.id }}</span>
            <span class="thread-meta">{{ thread.createdAt }}</span>
        </div>
    </div>
    <div v-else>
        <p>Loading threads…</p>
    </div>
</template>

<style>
.threads {
    padding: 0.5rem;
}

.thread {
    cursor: pointer;
    padding: 1rem;
    margin-bottom: 15px;
    border: 1px solid lightblue;
    overflow: hidden;
}

.thread-title {
    display: block;
}
.thread-meta {
    display: block;
}
</style>