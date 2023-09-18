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
        const result = threads.reduce((res: any, thread: any) => {
            if (thread.publishedAt) {
                res.published.push(thread)
            } else if (thread.scheduledAt) {
                res.scheduled.push(thread)
            } else {
                res.drafts.push(thread)
            }
            return res
        }, {
            drafts: [],
            scheduled: [],
            published: []
        })
        return result
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
        <div class="thread-list">
            <div class="thread-list-title">
                <i class="pi pi-file-edit"></i>
                <span>Drafts</span>
            </div>
            <div class="thread-list-items">
                <div class="thread" v-for="(thread) in threads.drafts" @click="selectThread(thread.id)">
                    <div class="thread-meta">
                        <Badge :severity="badgeStyle(thread)"></Badge>
                        {{ (new Date(thread.createdAt)).toLocaleString() }} · {{ thread.nbMessages }} messages
                    </div>
                    <div class="thread-title">{{ thread.title }}</div>
                </div>
            </div>
        </div>
        <div class="thread-list">
            <div class="thread-list-title">
                <i class="pi pi-clock"></i>
                <span>Scheduled</span>
            </div>
            <div class="thread-list-items">
                <div class="thread" v-for="(thread) in threads.scheduled" @click="selectThread(thread.id)">
                    <div class="thread-meta">
                        <Badge :severity="badgeStyle(thread)"></Badge>
                        {{ (new Date(thread.createdAt)).toLocaleString() }} · {{ thread.nbMessages }} messages
                    </div>
                    <div class="thread-title">{{ thread.title }}</div>
                </div>
            </div>
        </div>
        <div class="thread-list">
            <div class="thread-list-title">
                <i class="pi pi-history"></i>
                <span>Published</span>
            </div>
            <div class="thread-list-items">
                <div class="thread" v-for="(thread) in threads.published" @click="selectThread(thread.id)">
                    <div class="thread-meta">
                        <Badge :severity="badgeStyle(thread)"></Badge>
                        {{ (new Date(thread.createdAt)).toLocaleString() }} · {{ thread.nbMessages }} messages
                    </div>
                    <div class="thread-title">{{ thread.title }}</div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Loading threads…</p>
    </div>
</template>

<style scoped>
.thread-list-title {
    background-color: #F9F9F9;
    padding: 0.5rem 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 600;
}

.thread-list-title>.pi {
    margin-right: 0.5rem;
}

.thread-list-items {
    margin-bottom: 0.5rem;
}

.thread {
    cursor: pointer;
    padding: 0.5rem 1rem;
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