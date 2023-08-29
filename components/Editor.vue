<template>
    <div class="messages" v-for="(message, index) in messages">
        <div class="message">
            <textarea v-model="message.body" placeholder="What's up?" cols="64"></textarea>
            <div class="actions">
                <!-- <div role="button" aria-label="Gallery" tabindex="0"></div>-->
                <div class="message-index"><span>#{{ index + 1 }}</span></div>
                <div class="message-length">{{ message.body.length }}/500</div>
                <div role="button" tabindex="0" title="Add" @keyup.enter="addMessageBelow(index + 1)" @click="addMessageBelow(index + 1)"><span>+</span></div>
                <div role="button" tabindex="0" title="Remove" @keyup.enter="removeMessage(index)" @click="removeMessage(index)"><span>-</span></div>
            </div>
        </div>
    </div>
    <div class="publish">
        <div role="button" tabindex="0" @click="publishThread()"><span>Post</span></div>
    </div>
</template>

<script setup lang="ts">
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
    await $fetch('/api/threads', { method: 'post', body: { messages: nonEmptyMessages } })
}
</script>

<style>

.publish {
    border-top: 1px solid lightsteelblue;
    padding: 20px 0;
}
.publish div[role="button"] {
    border: 1px solid lightsteelblue;
    border-radius: 10px;
    cursor: pointer;
    display: inline-block;
    padding: 5px 10px;
}

textarea {
    resize: none;
    border: 1px solid lightsteelblue;
    border-radius: 5px;
    padding: 8px;
}

textarea:focus {
    outline: none !important;
}

.actions {
    display: flex;
    flex-direction: row;
}

.actions div {
    margin-right: 8px;
    padding: 5px 10px;
}

.actions div[role="button"] {
    cursor: pointer;
    border: 1px solid lightsteelblue;
    border-radius: 10px;
}

.messages {
    margin: 40px auto;
}

.message {
    margin-bottom: 30px;
}

.message-index {
    color: lightsteelblue;
}
</style>