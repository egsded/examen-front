import ClientesComponent from "@/components/ClientesComponent.vue";
import ColoniasComponent from "@/components/ColoniasComponent.vue";
import DomiciliosComponent from "@/components/DomiciliosComponent.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {path: '/', component: ColoniasComponent},
    {path: '/domicilios', component: DomiciliosComponent},
    {path: '/clientes', component: ClientesComponent}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;