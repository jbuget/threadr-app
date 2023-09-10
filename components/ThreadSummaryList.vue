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
            <span class="pi pi-comment" />
            <span class="thread-title">Thread #{{ thread.id }}</span>
            <!--<span class="thread-meta">{{ thread.createdAt }}</span>-->
            <span class="thread-nb-messages"> [{{ thread.nbMessages }} messages]</span>
        </div>
    </div>
    <div v-else>
        <p>Loading threads…</p>
    </div>
</template>

<style scoped>
.threads {
    padding: 0.5rem;
}

.thread {
    cursor: pointer;
    padding: 0.5rem;
    margin-bottom: 15px;
    border: 1px solid lightgray;
    overflow: hidden;
}

.thread-title {
    display: inline-block;
    margin-left: 0.5rem;
}

.thread-meta {
    display: block;
}
</style>