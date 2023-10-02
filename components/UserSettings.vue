<script setup lang="ts">
const { data: settings, pending, error, refresh } = await useFetch(`/api/settings`, {
    transform: (input: any) => {
        const result: any = {
            display: [{
                ref: 'display-name',
                name: 'Name',
                value: input?.display_name,
                placeholder: ''
            }, {
                ref: 'avatar-url',
                name: 'Avatar URL',
                value: input?.avatar_url,
                placeholder: ''
            }],
            platforms: [{
                name: 'Bluesky',
                enabled: input.bluesky_enabled,
                fields: [{
                    ref: 'bluesky-url',
                    name: 'URL',
                    value: input?.bluesky_url,
                    placeholder: ''
                }, {
                    ref: 'bluesky-identifier',
                    name: 'Identifier',
                    value: input?.bluesky_identifier,
                    placeholder: 'Lorem ipsum'
                }, {
                    ref: 'bluesky-password',
                    name: 'Password',
                    value: input?.bluesky_password,
                    placeholder: ''
                }]
            }, {
                name: 'Mastodon',
                enabled: input?.mastodon_enabled,
                fields: [{
                    ref: 'mastodon-url',
                    name: 'URL',
                    value: input?.mastodon_url,
                    placeholder: ''
                }, {
                    ref: 'mastodon-access-token',
                    name: 'Access token',
                    value: input?.mastodon_access_token,
                    placeholder: ''
                }]
            }, {
                name: 'Twitter',
                enabled: input?.twitter_enabled,
                fields: [{
                    ref: 'twitter-consumer-key',
                    name: 'Consumer key',
                    value: input?.twitter_consumer_key,
                    placeholder: ''
                }, {
                    ref: 'twitter-consumer-secret',
                    name: 'Consumer secret',
                    value: input?.twitter_consumer_secret,
                    placeholder: ''
                }, {
                    ref: 'twitter-access-token',
                    name: 'Access token',
                    value: input?.twitter_access_token,
                    placeholder: ''
                }, {
                    ref: 'twitter-access-secret',
                    name: 'Access secret',
                    value: input?.twitter_access_secret,
                    placeholder: ''
                }]
            }]
        }
        return result
    }
})
</script>

<template>
    <div class="user-settings" v-if="!pending && settings">
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