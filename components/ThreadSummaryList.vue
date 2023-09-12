<script setup lang="ts">
const emit = defineEmits<{
    threadSelected: [id: number]
}>()

const selectThread = (threadId: number) => {
    emit('threadSelected', threadId);
}

const { data: threads } = await useFetch(
    '/api/threads', {
    transform: (input: any) => {
        const threads = input.map((threadData: any) => ({
            id: threadData.id,
            createdAt: threadData.createdAt,
            updatedAt: threadData.updatedAt,
            scheduledAt: threadData.scheduledAt,
            publishedAt: threadData.publishedAt,
            nbMessages: threadData.nbMessages
        }))
        return threads
    }
})
</script>

<template>
    <div class="threads" v-if="threads">
        <div class="thread" v-for="(thread) in threads" @click="selectThread(thread.id)">
            <span class="pi pi-comment" />
            <span class="thread-title">Thread #{{ thread.id }}</span>
            <span> - </span>
            <!--<span class="thread-meta">{{ thread.createdAt }}</span>-->
            <span class="thread-nb-messages">{{ thread.nbMessages }} messages</span>
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
    overflow: hidden;
    border-radius: 5px;
}
.thread:hover,
.thread:focus {
    background-color: rgba(100, 116, 139, 0.04);
}

.thread-title {
    display: inline-block;
    margin-left: 0.5rem;
}

.thread-meta {
    display: block;
}

.thread-nb-messages {
    font-size: 0.8rem;
    color: grey;
}
</style>