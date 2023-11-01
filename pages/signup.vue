<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

const name = ref(null)
const username = ref(null)
const password = ref(null)
</script>

<template>
    <form class="signup-form">
        <div class="fields">
            <div class="field field--name">
                <label for="name">Full name</label>
                <InputText type="text" name="name" v-model="name" />
            </div>
            <div class="field field--username">
                <label for="username">Username</label>
                <InputText type="text" name="username" v-model="username" />
            </div>
            <div class="field field--password">
                <label for="password">Password</label>
                <Password name="password" v-model="password" :feedback="false" />
            </div>
            <div>
                <a href="/login">Log in</a>
            </div>
        </div>
        <div class="actions">
            <div class="action--submit">
                <Button label="Submit" />
            </div>
        </div>
    </form>
</template>


<style>
.signup-form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    padding: 1rem;
}

.field {
    display: block;
    flex-direction: column;
    flex-grow: 1;
    margin: 1rem 0;
}

.field>label {
    display: block;
    margin-bottom: 0.5rem;
}

.field>input {
    display: block;
}
</style>