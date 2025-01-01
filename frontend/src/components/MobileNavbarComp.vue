<script setup>

import { ref, watch } from 'vue'
import { useGlobalStore } from '@/store/useGlobalStore';
import { useRouter } from 'vue-router';
import AdminBarComp from '@/components/AdminBarComp.vue';

const store = useGlobalStore();
const router = useRouter();
const dark = ref(false);
const isAdmin = ref(false);
const isLoggedIn = ref(false);
const visible = ref(false);

watch(() => store.getAdmin, () => {
    isAdmin.value = store.getAdmin
    isLoggedIn.value = store.getUname ? true : false
})


const checkAccount = async () => {
    if (!isLoggedIn.value) {
        router.push('/user/login');
        return false;
    }
    else {
        return true
    }
}

const openCart = async () => {
    const result = await checkAccount();
    if (!result) return;
    router.push('/cart');
}

const logout = () => {
    localStorage.clear();
    store.clear();
    isLoggedIn.value = false;
    router.push('/user/login');
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
    dark.value = !dark.value;
}

</script>

<template>
    <Drawer @close="visible = false" v-model:visible="visible">
        <template #container="{ closeCallback }">
            <div class="flex flex-column h-full">
                <div class="flex justify-content-between px-3 pt-4 gap-3">
                    <span class="font-semibold text-2xl">Menu</span>
                    <Button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined />
                </div>
                <div class="overflow-y-auto flex flex-column justify-content-center pt-3 px-4 gap-5 my-4">
                    <a @click="openCart" class="flex align-items-center gap-2"><i class="pi pi-shopping-cart" />Shopping
                        Cart</a>
                    <a @click="toggleDarkMode()">
                        <div v-if="dark" class="flex align-items-center gap-2">
                            <i class="pi pi-sun"></i> Light Mode
                        </div>
                        <div v-else class="flex align-items-center gap-2">
                            <i class="pi pi-moon"></i> Dark Mode
                        </div>
                    </a>
                    <router-link v-if="!store.getUname" to="/user/login">
                        <a class="flex align-items-center gap-2"><i class="pi pi-user" />Log In</a>
                    </router-link>
                    <a v-else @click="logout" class="flex align-items-center gap-2"><i class="pi pi-sign-out" />Log
                        Out</a>
                    <router-link v-if="store.getUname" to="/user" class="font-bold"> User: {{ store.getUname
                        }}
                    </router-link>
                    <router-link v-else to="/user" class="font-bold"> User: Guest </router-link>
                    <!-- <router-link to="/">
                        <a>Home</a>
                    </router-link> -->
                    <router-link to="/product">
                        <a>Product</a>
                    </router-link>
                    <!-- <router-link to="/post">
                        <a>Post</a>
                    </router-link> -->
                    <hr class="mx-0" />
                    <router-link v-if="isAdmin" to="/admin/users">
                        <a>Admin</a>
                    </router-link>
                    <AdminBarComp v-if="isAdmin" />
                </div>
                <div class="mt-auto">
                    <hr class="mb-4 mx-4" />
                    <div class="font-bold m-4 p-4">Mobile View</div>
                </div>
            </div>
        </template>
    </Drawer>

    <div class="flex justify-content-between align-items-center p-2">
        <Button icon="pi pi-bars p-2" @click="visible = true" />
        <div class="flex justify-content-center align-items-center gap-5">
            <router-link to="/product">
                <div class="flex align-items-center justify-content-center"
                    style="width: 36px; height: 36px; background-color: white; border-radius: 50%;">
                    <img src="@/assets/shopping-bag-32px.png"
                        style="width: 80%; height: 80%; object-fit: cover; object-position: center;" />
                </div>
            </router-link>
        </div>
    </div>
</template>