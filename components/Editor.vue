<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const toast = useToast();

const messages = reactive([{
    text: '',
    attachments: []
}])

function addMessageBelow(index: number): void {
    const newMessage = { text: '', attachments: [] }
    messages.splice(index, 0, newMessage);
}

function removeMessage(index: number): void {
    messages.splice(index, 1);
    if (messages.length === 0) {
        addMessageBelow(0)
    }
}

async function saveThread(): Promise<void> {
    const thread = { messages }
    console.log(thread)
    await $fetch('/api/threads', { method: 'post', body: { thread } })
    toast.add({ severity: 'success', summary: 'Thread saved', detail: `${messages.length} posts published`, life: 3000 });
}

async function publishThread(): Promise<void> {
    const nonEmptyMessages = messages.filter((message) => message.text.trim().length > 0 || message.attachments.length > 0)
    await $fetch('/api/publications', { method: 'post', body: { messages: nonEmptyMessages } })
    toast.add({ severity: 'success', summary: 'Thread published', detail: `${nonEmptyMessages.length} posts published`, life: 3000 });
}

</script>

<template>
    <div class="editor">
        <Toast />
        <div class="messages">
            <div class="message" v-for="(message, index) in messages">
                <Message :index=index :message=message @addMessageBelow="addMessageBelow(index + 1)" @removeMessage="removeMessage(index)"/>
            </div>
            <Divider />
            <div>
                <div class="save">
                <Button label="Save" icon="pi pi-save" severity="info" size="small" @click="saveThread" />
            </div>
            <div class="publish">
                <Button label="Publish" icon="pi pi-send" severity="success" size="small" @click="publishThread" />
            </div>
            </div>
        </div>
    </div>
</template>

<style>
.messages {
    margin: 40px auto;
    display: flex;
    flex-direction: column;
}

</style>