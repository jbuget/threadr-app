<script setup lang="ts">
const { data: settings, pending, error, refresh } = await useFetch(`/api/settings`, {
    transform: (input: any) => {
        let settings: any

        if (input) {
            settings = input
        } else {
            settings = {}
            settings.display_name = ''
            settings.avatar_url = ''
            settings.bluesky_enabled = false
            settings.bluesky_url = ''
            settings.bluesky_identifier = ''
            settings.bluesky_password = ''
            settings.mastodon_enabled = false
            settings.mastodon_url = ''
            settings.mastodon_access_token = ''
            settings.twitter_enabled = false
            settings.twitter_consumer_key = ''
            settings.twitter_consumer_secret = ''
            settings.twitter_access_token = ''
            settings.twitter_access_secret = ''
        }

        const result: any = {
            display: [{
                ref: 'display-name',
                name: 'Name',
                value: settings.display_name,
                placeholder: ''
            }, {
                ref: 'avatar-url',
                name: 'Avatar URL',
                value: settings.avatar_url,
                placeholder: ''
            }],
            platforms: [{
                name: 'Bluesky',
                enabled: settings.bluesky_enabled,
                fields: [{
                    ref: 'bluesky-url',
                    name: 'URL',
                    value: settings.bluesky_url,
                    placeholder: ''
                }, {
                    ref: 'bluesky-identifier',
                    name: 'Identifier',
                    value: settings.bluesky_identifier,
                    placeholder: 'Lorem ipsum'
                }, {
                    ref: 'bluesky-password',
                    name: 'Password',
                    value: settings.bluesky_password,
                    placeholder: ''
                }]
            }, {
                name: 'Mastodon',
                enabled: settings.mastodon_enabled,
                fields: [{
                    ref: 'mastodon-url',
                    name: 'URL',
                    value: settings.mastodon_url,
                    placeholder: ''
                }, {
                    ref: 'mastodon-access-token',
                    name: 'Access token',
                    value: settings.mastodon_access_token,
                    placeholder: ''
                }]
            }, {
                name: 'Twitter',
                enabled: settings.twitter_enabled,
                fields: [{
                    ref: 'twitter-consumer-key',
                    name: 'Consumer key',
                    value: settings.twitter_consumer_key,
                    placeholder: ''
                }, {
                    ref: 'twitter-consumer-secret',
                    name: 'Consumer secret',
                    value: settings.twitter_consumer_secret,
                    placeholder: ''
                }, {
                    ref: 'twitter-access-token',
                    name: 'Access token',
                    value: settings.twitter_access_token,
                    placeholder: ''
                }, {
                    ref: 'twitter-access-secret',
                    name: 'Access secret',
                    value: settings.twitter_access_secret,
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