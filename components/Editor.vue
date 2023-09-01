<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const toast = useToast();

const messages = reactive([{
    text: '',
    files: []
}])

function addMessageBelow(index: number) {
    const newMessage = { text: '', files: [] }
    messages.splice(index, 0, newMessage);
}

function removeMessage(index: number) {
    messages.splice(index, 1);
    if (messages.length === 0) {
        addMessageBelow(0)
    }
}

async function publishThread() {
    const nonEmptyMessages = messages.filter((message) => message.text.trim().length > 0)
    //await $fetch('/api/threads', { method: 'post', body: { messages: nonEmptyMessages } })
    toast.add({ severity: 'success', summary: 'Thread published', detail: `${nonEmptyMessages.length} posts published`, life: 3000 });
}

function onAdvancedUpload(event?: any) {
    console.log(event)
    toast.add({ severity: 'success', summary: 'Success', detail: `File(s) uploaded`, life: 3000 });
};
</script>

<template>
    <div class="editor">
        <Toast />
        <div class="messages">
            <div class="message" v-for="(message, index) in messages">
                <Message :index=index :message=message @add-message-below="addMessageBelow(index)" @remove-message="removeMessage(index)"/>
            </div>
            <Divider />
            <div class="publish">
                <Button label="Publish" icon="pi pi-send" severity="success" @click="publishThread" />
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