<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { Thread } from '~/models/models'
import { generateUniqueKey } from '~/utils/utils'
const toast = useToast();

/* Model */

const updateKey = ref(generateUniqueKey('message-list'))

const props = defineProps<{
  threadId: number | null
}>()

const emit = defineEmits(['thread-saved', 'thread-deleted'])

const { data: thread, pending } = await useAsyncData(
  'thread',
  async () => {
    let thread: Thread
    if (props.threadId) {
      const threadData:any = await $fetch(`/api/threads/${props.threadId}`)
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
        })
      }
    } else {
      thread = {
        messages: [{
          text: '',
          attachments: []
        }]
      }
    }
    return thread
  }, {
  watch: [props]
})

/* Controller */

function addMessageBelow(index: number): void {
  console.log('addMessageBelow', index)
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
  if (thread.value && thread.value.messages) {
    thread.value.id = await doSaveThread(thread.value)
    toast.add({ severity: 'success', summary: 'Thread saved', detail: `${thread.value.messages.length} posts saved`, life: 3000 });
  }
}

async function publishThread(): Promise<void> {
  if (thread.value && thread.value.messages) {
    thread.value.id = await doSaveThread(thread.value)
    const nonEmptyMessages = thread.value.messages.filter((message: any) => message.text.trim().length > 0 || message.attachments.length > 0)
    await $fetch(`/api/threads/${thread.value.id}/publication`, { method: 'post', body: { messages: nonEmptyMessages } })
    toast.add({ severity: 'success', summary: 'Thread published', detail: `${nonEmptyMessages.length} posts published`, life: 3000 });
  }
}

async function deleteThread(): Promise<void> {
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
}

</script>

<template>
  <div class="editor">
    <Toast />
    <!-- you will need to handle a loading state -->
    <div class="editor-content" v-if="!pending && thread">
      <div class="thread-header">
        <h2 class="thread-title">ID: {{ thread.id }}</h2>
        <div class="thread-actions">
          <div class="save">
            <Button label="Save" icon="pi pi-save" severity="info" size="small" @click="saveThread" />
          </div>
          <div class="publish">
            <Button label="Publish" icon="pi pi-send" severity="success" size="small" @click="publishThread" />
          </div>
          <div class="delete">
            <Button label="Delete" icon="pi pi-trash" severity="danger" size="small" @click="deleteThread" />
          </div>
        </div>
      </div>

      <div class="messages" :key="updateKey">
        <template v-for="(message, index) in thread.messages" >
          <div class="message-wrapper">
            <MessageEditor :index="index" :message="message" @addMessageBelow="addMessageBelow(index + 1)"
              @removeMessage="removeMessage(index)" />
          </div>
        </template>
      </div>
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
  z-index: 9999;
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