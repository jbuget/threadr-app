<script setup lang="ts">
import Avatar from 'primevue/avatar'
import { FileUploadUploadEvent } from "primevue/fileupload";
import { useToast } from "primevue/usetoast";
import { Attachment, Message } from "~/models/models";
import { debounce } from 'throttle-debounce';
import PQueue from 'p-queue';

const config = useRuntimeConfig()

const toast = useToast();

const props = defineProps<{
    index: number,
    message: any
}>()

const message: any = ref(props.message)

const emit = defineEmits(['add-message-below', 'remove-message', 'message-changed'])

function onUploadComplete(event: FileUploadUploadEvent) {
    const { files } = JSON.parse(event.xhr.response)

    let attachments = files.map((file: any) => ({
        originalFilename: file.originalFilename,
        location: file.location,
        mimetype: file.mimetype,
        size: file.size,
        al: file.alt,
    }));
    message.value.attachments.push(...attachments)

    toast.add({ severity: 'success', summary: 'Success', detail: `File(s) uploaded`, life: 3000 });
}

const messageAttachmentsStyle = computed(() => {
    if (message.value.attachments) {
        if (message.value.attachments.length === 2 || message.value.attachments.length === 4) {
            return { gridTemplateColumns: "1fr 1fr" }
        }
        if (message.value.attachments.length === 3) {
            return { gridTemplateColumns: "1fr 1fr 1fr" }
        }
    }
    return { gridTemplateColumns: "1fr" }
})

function removeMedia(index: number) {
    message.value.attachments.splice(index, 1)
}

const visible = ref(false)
const emptyFile: Attachment = {
    filename: '',
    location: '',
    size: 0,
    mimetype: ''
}
const editingMedia = ref(emptyFile)

function editMedia(attachment: Attachment) {
    visible.value = true
    editingMedia.value = attachment
}

function updateMedia() {
    visible.value = false
    editingMedia.value = emptyFile
}

function closeMediaEditionWithoutSave() {
    visible.value = false
}

const queue = new PQueue({ concurrency: 1 });

const inputChanged = debounce(250, () => {
    queue.clear();
    queue.add(() => emit('message-changed'));
})

</script>

<template>
    <div class="message">
        <div class="message-aside">
            <template v-if=config.public.avatarUrl>
                <Avatar :image="config.public.avatarUrl" class="mr-2" size="large" shape="circle" />
            </template>
            <template v-else>
                <Avatar label="P" class="mr-2" size="large" shape="circle" />
            </template>
            <div class="thread-line"></div>
        </div>
        <div class="message-main">
            <div class="message-meta">
                <span class="message-username">{{ config.public.displayingName }}</span>
            </div>
            <div class="message-text">
                <Textarea v-model="message.text" placeholder="What's up?" rows="2" autoResize :unstyled="true" @input="inputChanged" />
            </div>
            <div class="message-attachments" :style="messageAttachmentsStyle">
                <div class="attachment" v-for="(attachment, index) in message.attachments">
                    <Image class="attachment-img" :src=attachment.location alt="Image" />
                    <div class="attachment-actions">
                        <div class="edit-attachment">
                            <Button icon="pi pi-pencil" size="small" text rounded outlined @enter="editMedia(attachment)"
                                @click="editMedia(attachment)" severity="secondary" title="Edit alt" />
                        </div>
                        <div class="remove-attachment">
                            <Button icon="pi pi-times" size="small" text rounded outlined @enter="removeMedia(index)"
                                @click="removeMedia(index)" severity="secondary" title="Remove media" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="actions">
                <!-- <div role="button" aria-label="Gallery" tabindex="0"></div>-->
                <div class="message-length"><span class="message-text-length">{{ message.text.length }}</span> / 280</div>
                <div class="message-index"><span>#{{ index + 1 }}</span></div>
                <div class="add-attachments">
                    <!-- Max file size: ~1Mb because of BlueSky (Masto = 8Mb) --->
                    <FileUpload mode="basic" name="attachments" url="/api/media" accept="image/*" :multiple="true"
                        :maxFileSize="2000000" chooseLabel=" " :showCancelButton="false" :show-upload-button="false"
                        :unstyled="false" :auto="true" @upload="onUploadComplete($event)" title="Add media">
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
        <Dialog v-model:visible="visible" modal :header=editingMedia.filename :style="{ width: '50vw' }">
            <div class="media-edition">
                <Image :src=editingMedia.location></Image>
                <Textarea v-model="editingMedia.alt" placeholder="What is the content of the media" rows="2" autoResize
                    :unstyled="true"></Textarea>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @enter="closeMediaEditionWithoutSave()"
                    @click="closeMediaEditionWithoutSave()" text />
                <Button label="Yes" icon="pi pi-check" @enter="updateMedia()" @click="updateMedia()" autofocus />
            </template>
        </Dialog>
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
    color: #64748B;
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
    display: grid;
    width: 100%;
    grid-template-columns: 52px 1fr;
    gap: 10px;
}

.message-aside {
    position: relative;
    display: flex;
    flex-flow: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
}

.message-aside>.thread-line {
    width: 2px;
    margin-bottom: 4px;
    background: #E5E7EB;
    flex: 1 1 0%;
}

.message-wrapper:last-of-type .thread-line {
    visibility: hidden;
}

.message-main {
    display: flex;
    flex-direction: column;
}

.message-text {
    margin-bottom: 0.5rem;
}

.message-text>textarea {
    resize: none;
    border: none;
    width: 100%;
}

.message-text-length {
    color: black;
}

.message-attachments {
    display: grid;
    gap: 3px;
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    background-color: whitesmoke;
    margin-bottom: 0.5rem;
}

.attachment {
    position: relative;
    width: 100%;
    height: 0;
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

.attachment>.attachment-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.attachment>.attachment-actions>div {
    margin-left: 5px;
}

.attachment>.attachment-actions>div>.p-button {
    background-color: white;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border-radius: 5px;
}

.attachment>.attachment-actions>div>.p-button>.p-button-icon {
    font-size: .625rem;
    font-weight: 600;
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
    background-color: rgba(100, 116, 139, 0.16) !important;
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

.media-edition {}

.media-edition img {
    margin-bottom: 0.5rem;
    border-radius: 10px;
    width: 100%;
    height: auto;
    max-height: 280px;
    object-fit: cover;
    object-position: center center;
}

.media-edition textarea {
    width: 100%;
    resize: none;
    border: none;
}
</style>