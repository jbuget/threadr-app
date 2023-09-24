import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import Button from "primevue/button";
import Chip from "primevue/chip";
import Dialog from 'primevue/dialog';
import Divider from "primevue/divider";
import FileUpload from "primevue/fileupload";
import Image from "primevue/image";
import InlineMessage from "primevue/inlinemessage";
import InputSwitch from "primevue/inputswitch";
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToastService from 'primevue/toastservice';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.component("Avatar", Avatar);
    nuxtApp.vueApp.component("Badge", Badge);
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("Chip", Chip);
    nuxtApp.vueApp.component("Dialog", Dialog);
    nuxtApp.vueApp.component("Divider", Divider);
    nuxtApp.vueApp.component("FileUpload", FileUpload);
    nuxtApp.vueApp.component("Image", Image);
    nuxtApp.vueApp.component("InlineMessage", InlineMessage);
    nuxtApp.vueApp.component("InputSwitch", InputSwitch);
    nuxtApp.vueApp.component("InputText", InputText);
    nuxtApp.vueApp.component("Message", Message);
    nuxtApp.vueApp.component("Textarea", Textarea);
    nuxtApp.vueApp.component("Toast", Toast);
    //other components that you need
});

