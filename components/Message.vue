<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const toast = useToast();

class Attachment {
    location!: string;
    size!: number;
}

class Message {
    text!: string;
    files!: Attachment[];

    constructor(text: string) {
        this.text = text;
        this.files = []
    }
}

defineProps<{
  index: number,
  message: Message
}>()

defineEmits(['add-message-below', 'remove-message'])

function onAdvancedUpload(event?: any) {
    console.log(event)
    toast.add({ severity: 'success', summary: 'Success', detail: `File(s) uploaded`, life: 3000 });
};
</script>

<template>
    <div class="message">
        <div class="message-meta">
            <div class="message-index"><span>#{{ index + 1 }}</span></div>
        </div>
        <div class="message-text">
            <Textarea v-model="message.text" placeholder="What's up?" rows="4" autoResize></Textarea>
        </div>
        <div class="message-attachments">
            <div class="add-attachments">
                <!-- Max file size: ~8Mb, according to Mastodon max size --->
                <!-- cf. https://docs.joinmastodon.org/user/posting/#media -->
                <FileUpload mode="advanced" name="attachments" url="/api/media" accept="image/*,video/*" :multiple="true"
                    :fileLimit="4" :maxFileSize="8000000" chooseLabel="Add media…" :showCancelButton="false"
                    :show-upload-button="false" :unstyled="false" :auto="true" @upload="onAdvancedUpload($event)">
                    <template #empty>
                        <p>Drag and drop files to here to upload.</p>
                    </template>
                    <template #chooseicon>
                        <i class="pi pi-file"></i>
                    </template>
                </FileUpload>
            </div>
        </div>
        <div class="actions">
            <!-- <div role="button" aria-label="Gallery" tabindex="0"></div>-->
            <div class="message-length">{{ message.text.length }}/280</div>
            <div class="add-message" role="button" tabindex="0" title="Add message"
                @keyup.enter="$emit('add-message-below')" @click="$emit('add-message-below')">
                <span>+</span>
            </div>
            <div class="remove-message" role="button" tabindex="0" title="Remove message"
                @keyup.enter="$emit('remove-message')" @click="$emit('remove-message')">
                <span>-</span>
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

.message {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.message-text {

}
.message-text > textarea {
    width: 100%;
}

.message-attachments {

}

.message-index {
    color: lightsteelblue;
}
</style>