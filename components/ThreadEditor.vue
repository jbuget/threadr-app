<script setup lang="ts">
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast'
import { Thread } from '~/models/models'
import { generateUniqueKey } from '~/utils/utils'
const toast = useToast();

/* Model */

const updateKey = ref(generateUniqueKey('message-list'))

const threadScheduleDialogVisible = ref(false)

const props = defineProps<{
  threadId: number | null
}>()

const emit = defineEmits(['thread-saved', 'thread-deleted'])

const isThreadEditable = computed(() => {
  if (thread.value) {
    return !thread.value.scheduledAt && !thread.value.publishedAt
  }
  return true
})

const threadMessage = computed(() => {
  if (thread.value) {
    if (thread.value.publishedAt) {
      const date = new Date(thread.value.publishedAt)
      return `Thread published on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
    }
    if (thread.value.scheduledAt) {
      const date = new Date(thread.value.scheduledAt)
      return `Thread scheduled on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
    }
    if (thread.value.updatedAt) {
      const date = new Date(thread.value.updatedAt)
      return `Thread saved on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
    }
  }
  return ''
})

const { data: thread, pending } = await useAsyncData(
  'thread',
  async () => {
    let thread: Thread
    if (props.threadId) {
      const threadData: any = await $fetch(`/api/threads/${props.threadId}`)
      thread = {
        id: threadData.id,
        messages: threadData.latest.data.messages.map((message: any) => {
          const result = {
            text: message.text,
            attachments: message.attachments.map((attachment: any) => {
              const result = {
                filename: attachment.filename,
                location: attachment.location,
                mimetype: attachment.mimetype,
                size: attachment.size,
                alt: attachment.alt
              }
              return result
            })
          }
          return result
        }),
        updatedAt: threadData.updatedAt,
        scheduledAt: threadData.scheduledAt,
        publishedAt: threadData.publishedAt
      }
    } else {
      thread = {
        messages: [{
          text: '',
          attachments: []
        }],
        scheduledAt: undefined,
        publishedAt: undefined
      }
    }
    return thread
  }, {
  watch: [props]
})

/* Controller */

function addMessageBelow(index: number): void {
  if (thread.value && thread.value.messages) {
    thread.value.messages.splice(index, 0, { text: '', attachments: [] });
  }
  updateKey.value = generateUniqueKey('message-list')
}

function removeMessage(index: number): void {
  if (thread.value && thread.value.messages) {
    thread.value.messages.splice(index, 1);
    if (thread.value.messages.length === 0) {
      addMessageBelow(0)
    }
  }
  updateKey.value = generateUniqueKey('message-list')
}

async function doSaveThread(thread: Thread): Promise<number> {
  let url = '/api/threads'
  if (thread.id) {
    url += `/${thread.id}`
  }
  const response: any = await $fetch(url, { method: 'post', body: { messages: thread.messages } })
  emit('thread-saved')
  updateKey.value = generateUniqueKey('message-list')
  return response.id as number
}

async function saveThread(): Promise<void> {
  try {
    if (thread.value && thread.value.messages) {
      thread.value.id = await doSaveThread(thread.value)
      toast.add({ severity: 'success', summary: 'Thread saved', detail: `${thread.value.messages.length} posts saved`, life: 3000 });
    }
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Thread could not be saved', detail: err.message, life: 3000 });
  }
}

async function publishThread(): Promise<void> {
  try {
    if (thread.value && thread.value.messages) {
      thread.value.id = await doSaveThread(thread.value)
      const nonEmptyMessages = thread.value.messages.filter((message: any) => message.text.trim().length > 0 || message.attachments.length > 0)
      await $fetch(`/api/threads/${thread.value.id}/publication`, { method: 'post' })
      toast.add({ severity: 'success', summary: 'Thread published', detail: `${nonEmptyMessages.length} posts published`, life: 3000 });
    }
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Thread could not be published', detail: err.message, life: 3000 });
  }
}

async function scheduleThread(): Promise<void> {
  try {
    if (thread.value && thread.value.messages) {
      thread.value.id = await doSaveThread(thread.value)

      await $fetch(`/api/threads/${thread.value.id}/schedule`, { method: 'post', body: { scheduledAt: thread.value.scheduledAt } })

      threadScheduleDialogVisible.value = false
      toast.add({ severity: 'success', summary: 'Thread scheduled', detail: `Publication scheduled`, life: 3000 });
    }
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Thread could not be scheduled', detail: err.message, life: 3000 });
  }
}

async function cancelThreadSchedule(): Promise<void> {
  try {
    if (thread.value && thread.value.id && thread.value.scheduledAt) {

      await $fetch(`/api/threads/${thread.value.id}/schedule`, { method: 'delete' })

      toast.add({ severity: 'success', summary: 'Thread schedule canceled', detail: `Publication canceled`, life: 3000 });
    }
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Thread could not be scheduled', detail: err.message, life: 3000 });
  }
}

async function deleteThread(): Promise<void> {
  try {
    if (thread.value && thread.value.id) {
      const url = `/api/threads/${thread.value.id}`
      await $fetch(url, { method: 'delete' })
      emit('thread-deleted')
      toast.add({ severity: 'success', summary: 'Thread deleted', detail: `Removed thread ${thread.value.id} and its messages`, life: 3000 });
    }
    thread.value = {
      messages: [{
        text: '',
        attachments: []
      }]
    }
    updateKey.value = generateUniqueKey('message-list')
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Thread could not be deleted', detail: err.message, life: 3000 });
  }
}

function toggleThreadScheduleDialogVisible() {
  threadScheduleDialogVisible.value = !threadScheduleDialogVisible.value
}
</script>

<template>
  <div class="editor">
    <Toast />
    <!-- you will need to handle a loading state -->
    <div class="editor-content" v-if="!pending && thread">
      <div class="thread-header">
        <h2 class="thread-title">{{ thread.id }}</h2>
        <div class="thread-actions">
          <div class="save">
            <Button icon="pi pi-save" severity="info" size="small" @click="saveThread" rounded outlined
              :disabled="!isThreadEditable" />
          </div>
          <div class="publish">
            <Button icon="pi pi-send" severity="success" size="small" @click="publishThread" rounded outlined
              :disabled="!isThreadEditable" />
          </div>
          <div class="schedule">
            <Button icon="pi pi-calendar-times" severity="warning" size="small" @click="toggleThreadScheduleDialogVisible"
              @enter="toggleThreadScheduleDialogVisible" rounded outlined :disabled="!isThreadEditable" />
          </div>
          <div class="delete">
            <Button icon="pi pi-trash" severity="danger" size="small" @click="deleteThread" rounded outlined />
          </div>
        </div>
      </div>

      <div class="messages" :key="updateKey">
        <div v-if="thread.publishedAt">
          <Message severity="success" icon="pi pi-send" :closable="false">{{ threadMessage }}</Message>
        </div>
        <div v-else-if="thread.scheduledAt">
          <Message severity="warn" :closable="false">
            {{ threadMessage }}
            <Button icon="pi pi-times" aria-label="Cancel thread schedule" title="Cancel thread schedule" severity="warning" size="small" @click="cancelThreadSchedule"
              @enter="cancelThreadSchedule" rounded style="width: 0.875rem; height: 0.875rem; padding: 0.625rem; margin-left: 0.875rem;"></Button>
          </Message>
        </div>
        <div v-else-if="thread.updatedAt">
          <Message severity="info" icon="pi pi-save" :closable="false">{{ threadMessage }}</Message>
        </div>

        <template v-for="(message, index) in thread.messages">
          <div class="message-wrapper">
            <MessageEditor :index="index" :message="message" @addMessageBelow="addMessageBelow(index + 1)"
              @removeMessage="removeMessage(index)" />
          </div>
        </template>
      </div>

      <Dialog class="p-fluid" v-model:visible="threadScheduleDialogVisible" modal
        header="Schedule the thread publication ">
        <Calendar v-model="thread.scheduledAt" showTime hourFormat="24" showButtonBar inline></Calendar>
        <div style="margin-top: 1rem;">
          <Button label="Schedule" severity="warning" @click="scheduleThread" @enter="scheduleThread" />
        </div>
      </Dialog>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  width: 500px;
}

.editor-content {
  position: relative;
  width: 100%;
}

.thread-header {
  position: fixed;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid lightgray;
  top: 0;
  background-color: white;
  z-index: 1;
  width: 500px;
}

.thread-title {
  display: block;
  flex-grow: 1;
}

.messages {
  margin: 74px auto 40px;
  display: flex;
  flex-direction: column;
  padding: 40px 0;
}

.thread-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 0;
}

.thread-actions button {
  margin-left: 0.5rem;
}
</style>