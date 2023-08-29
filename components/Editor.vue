<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const toast = useToast();

const messages = reactive([{
    body: '',
    files: []
}])

function addMessageBelow(index: number) {
    const newMessage = { body: '', files: [] }
    messages.splice(index, 0, newMessage);
}

function removeMessage(index: number) {
    messages.splice(index, 1);
    if (messages.length === 0) {
        addMessageBelow(0)
    }
}

async function publishThread() {
    const nonEmptyMessages = messages.filter((message) => message.body.trim().length > 0)
    //await $fetch('/api/threads', { method: 'post', body: { messages: nonEmptyMessages } })
    toast.add({ severity: 'success', summary: 'Thread published', detail: `${nonEmptyMessages.length} posts published`, life: 3000 });
}
</script>

<template>
    <div class="editor">
        <Toast />
        <div class="messages">
            <div class="message" v-for="(message, index) in messages">
                <Textarea v-model="message.body" placeholder="What's up?" rows="4" autoResize></Textarea>
                <div class="actions">
                    <!-- <div role="button" aria-label="Gallery" tabindex="0"></div>-->
                    <div class="message-index"><span>{{ index + 1 }}/{{ messages.length }}</span></div>
                    <div class="message-length">{{ message.body.length }}/280</div>
                    <div class="add-message" role="button" tabindex="0" title="Add message"
                        @keyup.enter="addMessageBelow(index + 1)" @click="addMessageBelow(index + 1)"><span>+</span></div>
                    <div class="remove-message" role="button" tabindex="0" title="Remove message"
                        @keyup.enter="removeMessage(index)" @click="removeMessage(index)"><span>-</span></div>
                </div>
            </div>
            <Divider />
            <div class="publish">
                <Button label="Publish" icon="pi pi-send" severity="success" @click="publishThread" />
            </div>
        </div>
    </div>
</template>

<style>
.publish {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.publish div[role="button"] {
    border: 1px solid lightsteelblue;
    border-radius: 5px;
    cursor: pointer;
    display: inline-block;
    padding: 10px 30px;
    color: rgb(0, 186, 124);
    background-color: rgb(0, 186, 124, 0.1);
    font-weight: 600;
}

.publish div[role="button"]:active,
.publish div[role="button"]:focus,
.publish div[role="button"]:hover {
    color: white;
    background-color: rgb(0, 186, 124);
}

.actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0;
}

.actions div {
    margin-right: 8px;
    padding: 5px 10px;
}

.actions div[role="button"] {
    cursor: pointer;
    border: 1px solid lightsteelblue;
    border-radius: 50%;
    height: 2rem;
    width: 2rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.actions div[role="button"].add-message {
    color: rgb(29, 155, 240);
    background-color: transparent;
}

.actions div[role="button"].add-message:active,
.actions div[role="button"].add-message:focus,
.actions div[role="button"].add-message:hover {
    background-color: rgb(29, 155, 240, 0.1);
}

.actions div[role="button"].remove-message {
    color: rgb(249, 24, 128);
    background-color: transparent;
}

.actions div[role="button"].remove-message:active,
.actions div[role="button"].remove-message:focus,
.actions div[role="button"].remove-message:hover {
    background-color: rgb(249, 24, 128, 0.1)
}

.messages {
    margin: 40px auto;
}

.message {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.message-index {
    color: lightsteelblue;
}
</style>