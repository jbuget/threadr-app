import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Dialog from 'primevue/dialog';
import Divider from "primevue/divider";
import FileUpload from "primevue/fileupload";
import Image from "primevue/image";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToastService from 'primevue/toastservice';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("Dialog", Dialog);
    nuxtApp.vueApp.component("Divider", Divider);
    nuxtApp.vueApp.component("FileUpload", FileUpload);
    nuxtApp.vueApp.component("Image", Image);
    nuxtApp.vueApp.component("Textarea", Textarea);
    nuxtApp.vueApp.component("Toast", Toast);
    //other components that you need
});

