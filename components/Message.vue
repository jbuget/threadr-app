<script setup lang="ts">
import { FileUploadBeforeUploadEvent, FileUploadRemoveEvent, FileUploadRemoveUploadedFile, FileUploadSelectEvent, FileUploadUploadEvent } from "primevue/fileupload";
import { useToast } from "primevue/usetoast";

const config = useRuntimeConfig()

const toast = useToast();

class Attachment {
    filename!: string
    location!: string
    size!: number
    mimetype!: string

    constructor(filename: string, location: string, mimetype: string, size: number) {
        this.filename = filename
        this.location = location
        this.mimetype = mimetype
        this.size = size
    }
}

class Message {
    text!: string;
    files!: Attachment[];

    constructor(text: string) {
        this.text = text;
        this.files = []
    }
}

const props = defineProps<{
    index: number,
    message: Message
}>()

defineEmits(['add-message-below', 'remove-message'])

function onUploadComplete(event: FileUploadUploadEvent) {
    const { files } = JSON.parse(event.xhr.response)

    let attachments = files.map((file: any) => new Attachment(file.originalFilename, file.location, file.mimetype, file.size));
    props.message.files.push(...attachments)

    toast.add({ severity: 'success', summary: 'Success', detail: `File(s) uploaded`, life: 3000 });
}

function onUploadedFileRemoved(event: FileUploadRemoveUploadedFile) {
    const fileIndex = props.message.files.findIndex(file => file.filename === event.file.name)
    props.message.files.splice(fileIndex, 1)
}

const messageAttachmentsStyle = computed(() => {
    if (props.message.files) {
        if (props.message.files.length === 2 || props.message.files.length === 4) {
            return { gridTemplateColumns: "1fr 1fr" }
        }
        if (props.message.files.length === 3) {
            return { gridTemplateColumns: "1fr 1fr 1fr" }
        }
    }
    return { gridTemplateColumns: "1fr" }
})

/* function onFilesSelected(event: FileUploadSelectEvent) {
    let selectedFileIndexesToRemove: number[] = [] // by reverse order
    const selectedFiles = event.files
    for (const selectedFile of selectedFiles) {
        const alreadyUploadedFileIndex = props.message.files.findIndex((messageFile: any) => {
            return (messageFile.filename === selectedFile.name) && (messageFile.size === selectedFile.size)
        })
        if (alreadyUploadedFileIndex >= 0) {
            selectedFileIndexesToRemove.unshift(alreadyUploadedFileIndex)
        }
    }
    console.log(selectedFileIndexesToRemove.length)
    selectedFileIndexesToRemove.forEach((index) => {
        event.files.splice(index, 1)
    });
}
 */
</script>

<template>
    <div class="message">
        <div class="message-meta">
            <span class="message-username">{{ config.public.displayingName }}</span>
        </div>
        <div class="message-text">
            <Textarea v-model="message.text" placeholder="What's up?" rows="2" autoResize :unstyled="true"></Textarea>
        </div>
        <div class="message-attachments" :style="messageAttachmentsStyle">
            <div class="attachment" v-for="(file, index) in message.files">
                <Image :src=file.location class="attachment-img" alt="Image" />
            </div>
        </div>
        <div class="actions">
            <!-- <div role="button" aria-label="Gallery" tabindex="0"></div>-->
            <div class="message-length">{{ message.text.length }}/280</div>
            <div class="message-index"><span>#{{ index + 1 }}</span></div>
            <div class="add-attachments">
                <!-- Max file size: ~1Mb because of BlueSky (Masto = 8Mb) --->
                <FileUpload mode="basic" name="attachments" url="/api/media" accept="image/*" :multiple="true"
                    :fileLimit="4" :maxFileSize="1000000" chooseLabel=" " :showCancelButton="false"
                    :show-upload-button="false" :unstyled="false" :auto="true" @upload="onUploadComplete($event)"
                    @removeUploadedFile="onUploadedFileRemoved($event)" title="Add media">
                </FileUpload>
            </div>
            <div class="add-message-below">
                <Button icon="pi pi-plus" size="small" text @enter="$emit('add-message-below')"
                    @click="$emit('add-message-below')" severity="secondary" title="Add message below" />
            </div>
            <div class="remove-message">
                <Button icon="pi pi-minus" size="small" text @enter="$emit('remove-message')"
                    @click="$emit('remove-message')" severity="secondary" title="Delete this message" />
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
    padding: 0;
}

.actions div {
    margin-right: 0.5rem;
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

.message-username {
    font-weight: 900;
}

.message {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
}

.message-text>textarea {
    resize: none;
    border: none;
}

.message-text>textarea {
    width: 100%;
}

.message-length {
    color: gray;
}

.message-index {
    color: gray;
}

.message-attachments {
    display: grid;
    gap: 3px;
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    background-color: whitesmoke;
}

.attachment {
    position: relative;
    width: 100%;
    height: 0px;
    padding-bottom: 64.5%;
    overflow: hidden;
    box-sizing: border-box;
    line-height: 0;
}

.attachment>.img {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
}

.p-image>img {
    width: 100%;
}

.add-attachments {
    margin-right: 0 !important;
}

.p-fileupload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.p-button.p-fileupload-choose {
    height: 3rem;
    width: 3rem;
    padding: 0;
    background-color: transparent;
    border-color: transparent;
    color: #64748B;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.p-button.p-fileupload-choose:active,
.p-button.p-fileupload-choose:focus,
.p-button.p-fileupload-choose:hover {
    border-color: transparent;
    color: #64748B;
}

.p-button.p-fileupload-choose:active {
    background-color: rgba(100, 116, 139, 0.16)!important;
}

.p-button.p-fileupload-choose:hover {
    background-color: rgba(100, 116, 139, 0.04);
}

.p-button.p-fileupload-choose:focus {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #b0b9c6, 0 1px 2px 0 black;
}

.p-fileupload-choose>svg {
    margin: 0 !important;
}

.p-fileupload-choose>.p-button-label {
    display: none;
}

.actions .p-button {
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
}
</style>