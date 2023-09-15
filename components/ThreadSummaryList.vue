<script setup lang="ts">
import Badge from 'primevue/badge';
import { ThreadSummary } from '~/models/models';

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
            title: threadData.title,
            createdAt: threadData.createdAt,
            updatedAt: threadData.updatedAt,
            scheduledAt: threadData.scheduledAt,
            publishedAt: threadData.publishedAt,
            nbMessages: threadData.nbMessages
        }))
        return threads
    }
})

function badgeStyle(thread: ThreadSummary) {
    if (thread.publishedAt) {
        return 'success'
    }
    if (thread.scheduledAt) {
        return 'warning'
    }
    return 'info'
}
</script>

<template>
    <div class="threads" v-if="threads">
        <div class="thread" v-for="(thread) in threads" @click="selectThread(thread.id)">
            <div class="thread-meta">
                <Badge :severity="badgeStyle(thread)"></Badge>
                {{ (new Date(thread.createdAt)).toLocaleString() }} · {{ thread.nbMessages }} messages
            </div>
            <div class="thread-title">{{ thread.title }}</div>
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

.thread-meta {
    font-size: 0.8rem;
    color: grey;
}
.thread-title {
    display: inline-block;
    max-height: 2.75rem;
    overflow: hidden;
}

.thread-nb-messages {
    font-size: 0.8rem;
    color: grey;
}
</style>