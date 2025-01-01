<script setup>

import { ref, watch } from 'vue';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useRouter } from 'vue-router';

const store = useGlobalStore();
const router = useRouter();
const isAdmin = ref(false);
const dark = ref(false);
const isLoggedIn = ref(false);

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
    isAdmin.value = false;
    router.push('/user/login');
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
    dark.value = !dark.value;
}

</script>

<template>
    <Card>
        <template #content>
            <div class="flex align-items-center">
                <router-link to="/product">
                    <div class="flex align-items-center justify-content-center"
                        style="width: 36px; height: 36px; background-color: white; border-radius: 50%;">
                        <img src="@/assets/shopping-bag-32px.png"
                            style="width: 80%; height: 80%; object-fit: cover; object-position: center;" />
                    </div>
                </router-link>

                <div class="flex-auto flex left-0 justify-content-evenly align-items-center">
                    <!-- <router-link to="/">
                        <a>Home</a>
                    </router-link> -->
                    <!-- <router-link to="/post">
                        <a>Post</a>
                    </router-link> -->
                </div>
                <div class="flex align-items-center justify-content-evenly left-0 gap-5 ">
                    <router-link v-if="isAdmin" to="/admin/users">
                        <i class="pi pi-user-edit" />
                    </router-link>
                    <a @click="openCart"><i class="pi pi-shopping-cart" /></a>
                    <a @click="toggleDarkMode()">
                        <i v-if="dark" class="pi pi-sun"></i>
                        <i v-else class="pi pi-moon"></i>
                    </a>
                    <router-link v-if="!store.getUname" to="/user/login">
                        <a><i class="pi pi-user " /></a>
                    </router-link>
                    <a v-else @click="logout"><i class="pi pi-sign-out " /></a>
                    <router-link v-if="store.getUname" to="/user" class="font-bold "> User: {{ store.getUname }}
                    </router-link>
                    <router-link v-else to="/user" class="font-bold "> User: Guest </router-link>
                </div>
            </div>
        </template>
    </Card>
</template>