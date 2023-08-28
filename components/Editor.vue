<template>
    <div class="publish">
        <div role="button" tabindex="0"><span>Post</span></div>
    </div>

    <div class="messages" v-for="(message, index) in messages">
        <div class="message">
            <textarea v-model="message.body" placeholder="What's up?" cols="64"></textarea>
            <div class="actions">
                <!-- <div role="button" aria-label="Gallery" tabindex="0"></div>-->
                <div class="message-index"><span>#{{ index + 1 }}</span></div>
                <div class="message-length">{{ message.body.length }}/500</div>
                <div role="button" tabindex="0" title="Add" @click="addMessageBelow(index + 1)"><span>+</span></div>
                <div role="button" tabindex="0" title="Remove" @click="removeMessage(index)"><span>-</span></div>
            </div>
        </div>
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
</script>

<style>
.publish div[role="button"] {
    border: 1px solid grey;
    border-radius: 10px;
    cursor: pointer;
    display: inline-block;
    padding: 5px 10px;
}

textarea {
    resize: none;
    border: none;
}

textarea:focus {
    outline: none !important;
}

.actions {
    display: flex;
    flex-direction: row;
}

.actions div {
    margin: 0 10px;
    padding: 5px 10px;
}

.actions div[role="button"] {
    cursor: pointer;
    border: 1px solid grey;
    border-radius: 10px;
}

.message {
    margin-bottom: 30px;
}

.message-index {
    font-size: 1.25rem;
    color: grey;
}
</style>