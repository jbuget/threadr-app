<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const toast = useToast();

function addMessageBelow(index: number): void {
    if (props.thread.messages) {
        props.thread.messages.splice(index, 0, { text: '', attachments: [] });
    }
}

function removeMessage(index: number): void {
    if (props.thread.messages) {
        props.thread.messages.splice(index, 1);
        if (props.thread.messages.length === 0) {
            addMessageBelow(0)
        }
    }
}

async function saveThread(): Promise<void> {
    if (props.thread.messages) {
        await $fetch('/api/threads', { method: 'post', body: { messages: props.thread.messages } })
        toast.add({ severity: 'success', summary: 'Thread saved', detail: `${props.thread.messages.length} posts published`, life: 3000 });
    }
}

async function publishThread(): Promise<void> {
    if (props.thread.messages) {
        const nonEmptyMessages = props.thread.messages.filter((message: any) => message.text.trim().length > 0 || message.attachments.length > 0)
        await $fetch('/api/publications', { method: 'post', body: { messages: nonEmptyMessages } })
        toast.add({ severity: 'success', summary: 'Thread published', detail: `${nonEmptyMessages.length} posts published`, life: 3000 });
    }
}

const props = defineProps<{
    thread: any
}>()

</script>

<template>
    <div class="editor">
        <Toast />
        <!-- you will need to handle a loading state -->
        <div v-if="thread">
            <h2>ID: {{ thread.id }}</h2>
            <div class="messages">
                <div class="message" v-for="(message, index) in thread.messages">
                    <MessageEditor :index="index" :message="message" @addMessageBelow="addMessageBelow(index + 1)"
                        @removeMessage="removeMessage(index)" />
                </div>
                <Divider />
                <div class="actions">
                    <div class="save">
                        <Button label="Save" icon="pi pi-save" severity="info" size="small" @click="saveThread" />
                    </div>
                    <div class="publish">
                        <Button label="Publish" icon="pi pi-send" severity="success" size="small" @click="publishThread" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Loading...
        </div>

    </div>
</template>

<style>
.messages {
    margin: 40px auto;
    display: flex;
    flex-direction: column;
}

.actions {
    display: flex;
    align-items: center;
}
</style>