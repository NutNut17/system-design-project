<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useRouter } from 'vue-router';

const store = useGlobalStore();
const router = useRouter();
const products = ref([]);
const product = ref(null);
const images = ref([]);
const selectProductCount = ref(1);

const showDialog = ref(false);
const showAddCartSuccessDialog = ref(false);
const showAddCartFailedDialog = ref(false);
const showPurchaseSuccessDialog = ref(false);
const showPurchaseFailedDialog = ref(false);

const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

const isLoggedIn = ref(false);

watch(() => store.getUname, () => {
  isLoggedIn.value = store.getUname ? true : false
  console.log(isLoggedIn.value);
})
onMounted(async () => {
  console.log(store.getUname);
  try {
    const response = await axios.get(`${backendUrl}/api/products`);
    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});

// View details of a product card
const viewDetails = (prop) => {
  console.log(store.getUname);
  isLoggedIn.value = store.getUname ? true : false;
  console.log(isLoggedIn.value);
  console.log("Product details triggered:", prop);
  product.value = prop;
  product.value.images.forEach(image => {
    images.value.push({ itemImageSrc: `${backendUrl}/img/${prop.id}/${image}` });
  })
  showDialog.value = true;
};

// Close the details dialog for product card
const closeDetails = () => {
  images.value = [];
  product.value = null;
  showDialog.value = false;
};

// UTILITIES
const countRating = (data) => {
  if (data.ratingCount == 0) {
    data.ratingCount = 1
  }
  return Math.round(data.ratingScore / data.ratingCount)
}

const getStatusLabel = (quantity) => {
  if (quantity == 0) {
    return 'danger';
  }
  if (!quantity) {
    return 'danger';
  }
  if (quantity <= 2) {
    return 'warn';
  }
  if (quantity > 2) {
    return 'success';
  }
}

const getInventoryStatus = (quantity) => {
  if (quantity == 0) {
    return `${quantity}: OUTOFSTOCK`;
  }
  if (!quantity) {
    return 'ERROR'
  }
  if (quantity <= 2) {
    return `${quantity}: LOWSTOCK`;
  }
  if (quantity > 2) {
    return `${quantity}: INSTOCK`;
  }
}


const checkAccount = async () => {
  console.log(isLoggedIn.value);
  if (!isLoggedIn.value) {
    router.push('/user/login');
    return false;
  }
  else {
    return true
  }
}

const purchase = async () => {
  try {

    console.log('purchase');
    await checkAccount();
    const data = {
      user_id: store.getUserId,
      item_id: product.value.id,
      quantity: selectProductCount.value,
    }

    const response = await axios.post(`${backendUrl}/api/purchase`, data);

    showDialog.value = false;
    if (response.status === 201) {
      showPurchaseSuccessDialog.value = true;
      return
    }
    
    showPurchaseFailedDialog.value = true;
  } catch (error) {
    console.error(error);
  }
}

const addToCart = async () => {
  await checkAccount(); // 檢查是否已登入

  let success = false;

  const data = {
    user_id:store.getUserId,
    email: store.getEmail,
    productID: product.value.id,
    productCount: selectProductCount.value
  };

  try {
    // 發送請求到後端
    const response = await axios.post(`${backendUrl}/api/addcart`, data);
    if (response.status === 201) {
      success = true;
    }
  } catch (error) {
    console.error('Failed to add product to cart:', error);
  }

  // 關閉對話框並顯示結果
  showDialog.value = false;
  if (success) {
    showAddCartSuccessDialog.value = true;
  } else {
    showAddCartFailedDialog.value = true;
  }
}

const closeAddCartSuccess = () => {
  showAddCartSuccessDialog.value = false;
  window.location.reload();
}

const closeAddCartFailed = () => {
  showAddCartFailedDialog.value = false;
  window.location.reload();
}

const closePurchaseSuccess = () => {
  showPurchaseSuccessDialog.value = false;
  window.location.reload();
}

const closePurchaseFailed = () => {
  showPurchaseFailedDialog.value = false;
  window.location.reload();
}

const rateLiked = async () => {
  console.log('liked')
}

const rateDisliked = async () => {
  console.log('disliked')
}


</script>

<template>
  <div class="grid">
    <div v-for="product in products" :key="product.id" class="col-6 md:col-4 lg:col-3 xl:col-2 p-2">
      <Card class="h-full shadow-3" style="max-height: 25rem;">
        <template #header>
          <a @click="viewDetails(product)">
            <img :src="`${backendUrl}/img/${product.id}/${product.images[0]}`" :alt="product.name"
              style="width: 100%; height: 200px; object-fit: cover;" />
          </a>
        </template>
        <template #title>
          <div class="font-bold">{{ product.name }}</div class="font-bold">
        </template>
        <template #content>
          <div class="font-light">{{ product.category }}</div>
          <div class=" font-bold">${{ product.price.toFixed(2) }}</div>
        </template>
      </Card>
    </div>

    <Dialog v-model:visible="showDialog" :modal="true" :style="{ width: '90vw', maxWidth: '70rem' }"
      :header="`Product Details`" @close="closeDetails" @after-hide="closeDetails">
      <div class="grid ">

        <div class="col-12 md:col-6">
          <Galleria :value="images" :numVisible="5" :circular="true" containerStyle="max-width: 640px"
            :showItemNavigators="true" :showThumbnails="false" :showItemNavigatorsOnHover="true" :showIndicators="true">
            <template #item="slotProps">
              <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
            </template>
          </Galleria>
        </div>

        <div class="col-12 md:col-6 flex flex-column justify-content-between" v-if="product">
          <div class="flex flex-column">
            <div class="font-bold mt-4" style=" font-size: 1.5rem;">
              {{ product.name }}
            </div>
            <div class="font-light mt-2">
              {{ product.category }}
            </div>
            <div class="flex gap-3">
              <div class="font-bold mt-2">
                ${{ product.price.toFixed(2) }}
              </div>
              <div class="mt-2">
                <Tag :value="getInventoryStatus(product.quantity)" :severity="getStatusLabel(product.quantity)" />
              </div>
            </div>
            <div class="mt-2">
              <Rating :modelValue="countRating(product)" :readonly="true" />
            </div>
            <div class="mt-2">
              {{ product.description }}
            </div>
          </div>

          <div class="mt-4 flex flex-column gap-4">
            <InputNumber v-model="selectProductCount" showButtons buttonLayout="horizontal" style="width: 1rem" :min="0"
              :max="product.quantity">
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <div class="flex gap-3">
              <Button label="Purchase" icon="pi pi-shopping-cart" severity="success" @click="purchase" />
              <Button label="Add to Cart" icon="pi pi-shopping-cart" @click="addToCart" />
              <Button icon="pi pi-thumbs-up" class="p-button-rounded p-button-secondary" @click="rateLiked" />
              <Button icon="pi pi-thumbs-down" class="p-button-rounded p-button-secondary" @click="rateDisliked" />
            </div>
          </div>
        </div>

      </div>
    </Dialog>

    <Dialog v-model:visible="showAddCartSuccessDialog" :modal="true"
      :style="{ width: '50vw', maxWidth: '50rem', height: '50vh' }" @close="closeAddCartSuccess"
      @after-hide="closeAddCartSuccess">
      <div class="text-center">Successfully Added to Cart</div>
    </Dialog>

    <Dialog v-model:visible="showAddCartFailedDialog" :modal="true"
      :style="{ width: '50vw', maxWidth: '50rem', height: '50vh' }" @close="closeAddCartFailed"
      @after-hide="closeAddCartFailed">
      <div class="text-center">Failed Adding to Cart</div>
    </Dialog>

    <Dialog v-model:visible="showPurchaseSuccessDialog" :modal="true"
      :style="{ width: '50vw', maxWidth: '50rem', height: '50vh' }" @close="closePurchaseSuccess"
      @after-hide="closePurchaseSuccess">
      <div class="text-center">Successfully Purchased</div>
    </Dialog>

    <Dialog v-model:visible="showPurchaseFailedDialog" :modal="true"
      :style="{ width: '50vw', maxWidth: '50rem', height: '50vh' }" @close="closePurchaseFailed"
      @after-hide="closePurchaseFailed">
      <div class="text-center">Purchase Failed</div>
    </Dialog>
  </div>
</template>
