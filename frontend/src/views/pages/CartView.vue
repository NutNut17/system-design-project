<script setup>

import { ref, onMounted, computed } from 'vue';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import axios from 'axios';

const store = useGlobalStore();
const router = useRouter();
const toast = useToast();
const showPurchaseSuccessDialog = ref(false);
const showPurchaseFailedDialog = ref(false);
const cartItems = ref([]);
const isLoading = ref(false); // 初始化 isLoading
const hasError = ref(false); // 初始化錯誤狀態
const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

const fetchCartItems = async () => {
  try {
    isLoading.value = true; // 開始加載
    hasError.value = false; // 清除錯誤狀態
    console.error("Fetching cart items...");
    
    const data = {
      userId: store.getUserId, // 獲取使用者 ID
    };

    // 向後端請求購物車數據
    const response = await axios.post(`${backendUrl}/api/getcart`, data);
    cartItems.value = response.data; // 更新購物車數據
    console.log("Cart items:", cartItems.value);

  } catch (error) {
    console.error("Error fetching cart items:", error);
    hasError.value = true;

    // 顯示錯誤提示
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch cart items. Please try again later.',
      life: 3000,
    });
  } finally {
    isLoading.value = false; // 加載結束
  }
};








onMounted(async () => {
  fetchCartItems();


});

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
});

// const updateQuantity = (item, newQuantity) => {
//   item.quantity = newQuantity;
// };

const checkAccount = async () => {
  const userState = { uname: store.getUname, email: store.getEmail };
  if (!userState.uname || !userState.email) {
    router.push('/user/login');
  }
}

const removeItem = async (item) => {

  await checkAccount(); // 檢查是否已登入
  // 找到商品索引
  console.error("trigger removeItem");
  console.error(item.item_id);
  const index = cartItems.value.findIndex(i => i.id === item.item_id);
  const data = {
    userId:store.getUserId,
    itemId:item.item_id
    };


  try {
      const response =await axios.post(`${backendUrl}/api/removecart`,data);
    } catch (error) {
      console.error('Failed to sync with server:', error);
    }
  fetchCartItems();
  if (index !== -1) {
    // 從購物車中刪除商品
    cartItems.value.splice(index, 1);

    // 向後端發送刪除請求（可選）


    // 顯示成功消息
    toast.add({ 
      severity: 'success', 
      summary: 'Item Removed', 
      detail: `${item.name} has been removed from your cart.`, 
      life: 3000 
    });
  } else {
    // 如果商品不存在，顯示錯誤提示
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: `${item.name} is not in the cart.`, 
      life: 3000 
    });
  }
};



const purchase = async () => {
  await checkAccount(); // 檢查是否已登入
  console.error("trigger purchase");
  let success = false;

  const data = {
    userId:store.getUserId,
  };

  try {
    // 發送購買請求到後端
    const response = await axios.post(`${backendUrl}/api/cartpurchase`, data);
    success = response.status === 200;
  } catch (error) {
    console.error('Purchase failed:', error);
  }

  

  // 根據購買結果顯示對應提示
  console.error("success status");
  console.error(success);
  if (success) {
    fetchCartItems();
    showPurchaseSuccessDialog.value = true;
    toast.add({ severity: 'info', summary: 'Checkout', detail: 'Proceeding to checkout...', life: 3000 });
  } else {
    showPurchaseFailedDialog.value = true;
    toast.add({ severity: 'error', summary: 'Purchase Failed', detail: 'Failed to complete your purchase.', life: 3000 });
  }
}

const closePurchaseSuccess = () => {
  showPurchaseSuccessDialog.value = false;
  window.location.reload();
}

const closePurchaseFailed = () => {
  showPurchaseFailedDialog.value = false;
  window.location.reload();
}


</script>

<template>
  <div class="cart-view">
    <Card>
      <template #title>
        Your Shopping Cart
      </template>
      <!-- TODO: Handle shopping item added from product catalog, currently it's just a placeholder -->
      <template #content>




        <DataTable :value="cartItems" responsiveLayout="scroll">
          <!-- 商品名稱 -->
          <Column field="name" header="Product Name"></Column>

          <!-- 價格 -->
          <Column field="price" header="Price">
          <template #body="slotProps">
              ${{ slotProps.data.price.toFixed(2) }}
            </template>
          </Column>

          <!-- 商品描述 -->
          <Column field="description" header="Description"></Column>

          <!-- 購買數量 -->
          <Column field="quantity" header="Quantity">
          <template #body="slotProps">
            <InputNumber 
            v-model="slotProps.data.quantity" 
            @update:modelValue="updateQuantity(slotProps.data, $event)"
            :min="1" 
            :max="99" 
            disabled />
          </template>
          </Column>

          <!-- 刪除按鈕 -->
          <Column>
          <template #body="slotProps">
            <Button 
            icon="pi pi-trash" 
            class="p-button-rounded p-button-danger p-button-text"
            @click="removeItem(slotProps.data)" />
          </template>
          </Column>
        </DataTable>












 




 
        <div class="flex justify-content-between align-items-center mt-4">
          <div class="text-2xl font-bold">
            Total: ${{ total }}
          </div>
          <Button label="Purchase" icon="pi pi-shopping-cart" @click="purchase()" />
        </div>
      </template>
    </Card>
  </div>

  <Dialog v-model:visible="showPurchaseSuccessDialog" :modal="true"
    :style="{ width: '50vw', maxWidth: '50rem', height: '50vh' }" :header="`Information`" @close="closePurchaseSuccess"
    @after-hide="closePurchaseSuccess">
    <div class="text-center">purchase sucess</div>
  </Dialog>

  <Dialog v-model:visible="showPurchaseFailedDialog" :modal="true"
    :style="{ width: '50vw', maxWidth: '50rem', height: '50vh' }" :header="`Information`" @close="closePurchaseFailed"
    @after-hide="closePurchaseFailed">
    <div class="text-center">Failed to purchase</div>
  </Dialog>
</template>

<style scoped>
.cart-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>