<script setup lang="ts">
const settings = ref({
    display: [{
        ref: 'display-name',
        name: 'Name',
        value: '',
        placeholder: ''
    }, {
        ref: 'avatar-url',
        name: 'Avatar URL',
        value: '',
        placeholder: ''
    }],
    platforms: [{
        name: 'Bluesky',
        enabled: false,
        fields: [{
            ref: 'bluesky-url',
            name: 'URL',
            value: 'https://bsky.social',
            placeholder: ''
        }, {
            ref: 'bluesky-identifier',
            name: 'Identifier',
            value: '',
            placeholder: 'Lorem ipsum'
        }, {
            ref: 'bluesky-password',
            name: 'Password',
            value: '',
            placeholder: ''
        }]
    }, {
        name: 'Mastodon',
        enabled: false,
        fields: [{
            ref: 'mastodon-url',
            name: 'URL',
            value: 'https://piaille.fr',
            placeholder: ''
        }, {
            ref: 'mastodon-access-token',
            name: 'Access token',
            value: '',
            placeholder: ''
        }]
    }, {
        name: 'Twitter',
        enabled: false,
        fields: [{
            ref: 'twitter-consumer-key',
            name: 'Consumer key',
            value: '',
            placeholder: ''
        }, {
            ref: 'twitter-consumer-secret',
            name: 'Consumer secret',
            value: '',
            placeholder: ''
        }, {
            ref: 'twitter-access-token',
            name: 'Access token',
            value: '',
            placeholder: ''
        }, {
            ref: 'twitter-access-secret',
            name: 'Access secret',
            value: '',
            placeholder: ''
        }]
    }]
})
</script>

<template>
    <div class="user-settings">
        <div class="displaying">
            <h3>Display</h3>
            <div class="form-fields">
                <div class="form-field" v-for="(field, fieldIndex) in settings.display">
                    <label class="field-name" :for="field.ref">{{ field.name }}</label>
                    <InputText class="field-value" :id="field.ref" type="text" v-model="field.value"
                        :placeholder="field.placeholder" />
                </div>
            </div>
        </div>
        <Divider />
        <div class="writing">
            <h3>Platforms</h3>
            <template v-for="(platform, platformIndex) in settings.platforms">
                <div :class="['platform-settings', { disabled: !platform.enabled }]">
                    <div class="platform-enabled">
                        <span class="platform-name">{{ platform.name }}</span>
                        <InputSwitch v-model="platform.enabled" />
                    </div>
                    <div class="form-fields">
                        <div class="form-field" v-for="(field, fieldIndex) in platform.fields">
                            <label class="field-name" :for="field.ref">{{ field.name }}</label>
                            <InputText class="field-value" :id="field.ref" type="text" v-model="field.value"
                                :disabled="platform.enabled !== true" :placeholder="field.placeholder" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style>
.user-settings {
    display: flex;
    flex-direction: column;
    min-width: 600px;
}

.platform-settings {}

.platform-settings.disabled .field-name {
    opacity: 0.6;
}

.platform-name {
    display: block;
    font-weight: 600;
    font-size: 1.125rem;
}

.platform-enabled {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.form-fields {
    margin-bottom: 1rem;
}

.form-field {
    margin-bottom: 0.85rem;
}

.field-name {
    display: block;
    margin-bottom: 5px;
}

.field-value {}
</style>