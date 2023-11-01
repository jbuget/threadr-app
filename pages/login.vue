<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

const { signIn, signOut, session, status, cookies, getProviders } = useAuth()

const username = ref(null)
const password = ref(null)
</script>

<template>
    <div>
        <a href="/api/auth/signin" class="buttonPrimary">Native Link Sign in</a>
        <button @click="signIn(`github`)">
            JS Sign In
        </button>
        <button @click="signOut()">
            Sign Out
        </button>
    </div>

    <form class="login-form">
        <div class="fields">
            <div class="field field--username">
                <label for="username">Username</label>
                <InputText type="text" name="username" v-model="username" />
            </div>
            <div class="field field--password">
                <label for="password">Password</label>
                <Password name="password" v-model="password" :feedback="false" />
            </div>
            <div>
                <a href="/signup">Create an account</a>
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
.login-form {
    display: flex;
    flex-direction: column;
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