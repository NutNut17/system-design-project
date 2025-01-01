<script setup>

import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

// Initialization
const toast = useToast();
const dt = ref();

const carts = ref();
const selectedpurchase = ref();

const userDialog = ref(false);
const deleteUserDialog = ref(false);
const deletepurchaseDialog = ref(false);

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const isUpdate = ref(false);
const initialValues = ref({
    uname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    country: { district: '', city: '', address: '' },
});
const userId = ref(null);
const uname = ref(null);
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const address = ref('');
const cond1 = ref(true); // When password is empty
const cond2 = ref(true); // When password does not match
const selectedCounty = ref('');
const selectedDistrict = ref('');
const counties = ref([]);
const districts = ref([]);
const allDistricts = ref([]);

const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

onMounted(async () => {
    await fetchPurchase();
});

const fetchPurchase = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/carts`);
        if (response && response.data) {
            carts.value = response.data;
            carts.value.forEach(cart => {
                cart.createdAt = new Date(cart.createdAt).toLocaleString();
            })
        } else {
            console.error('No data received from the API');
        }
    } catch (error) {
        console.error("Client can't get purchase: ", error);
    }
};

watch(selectedCounty, (newValue) => {
    // Update districts based on the selected county
    const index = counties.value.findIndex((item) => item === newValue);
    if (index !== -1) {
        const array = allDistricts.value[index];
        districts.value = [];
        array.english.forEach((value, index) => {
            districts.value.push(`${value} ${array.mandarin[index]}`);
        })
        // console.log(districts.value);
    }
});

const resolver = ref(zodResolver(
    z.object({
        uname: z.string()
            .min(3, { message: 'Minimum 3 characters.' })
            .max(30, { message: 'Maximum 30 characters.' }),
        email: z.string()
            .email('Invalid email'),
        password: z.string()
            .min(6, { message: 'Minimum 6 characters.' })
            .max(20, { message: 'Maximum 20 characters.' })
            .refine((value) => /[a-z]/.test(value), {
                message: 'Must have a lowercase letter.'
            })
            .refine((value) => /[A-Z]/.test(value), {
                message: 'Must have an uppercase letter.'
            })
            .refine((value) => /[0-9]/.test(value), {
                message: 'Must have a number.'
            })
            .refine((value) => {
                if (value) {
                    cond1.value = false;
                    return true
                } else {
                    cond1.value = true;
                    return false
                }
            }),
        address: z.string()
            .min(1, { message: 'Address is required' }),
        county: z.any().refine((val) => {
            if (val) {
                return true
            }
            return false;
        }, { message: 'County is required.' }),
        district: z.any().refine((val) => {
            console.log(val);
            if (val) {
                return true
            }
            return false;
        }, { message: 'District is required.' }),
        passwordConfirm: z.string(),

    }).superRefine(async (data, ctx) => {

        // console.log(data);
        // Check if password does not match
        if (data.password !== data.passwordConfirm) {
            cond2.value = true;
            ctx.addIssue({
                path: ['passwordConfirm'],
                message: 'Passwords do not match.',
            });
        }
        else {
            cond2.value = false;
        }

        // Proceed if password validation is valid
        if (cond1.value || cond2.value) {
            return
        }

        try {
            const datas =
            {
                uname: data.uname,
                email: data.email,
                password: data.password,
                address: {
                    address: data.address,
                    county: data.county,
                    district: data.district,
                }
            }
            // console.log(datas);

            // Check if username or email already exists
            let userResponse;
            console.log(isUpdate.value, userId.value, datas);

            // Add new user
            if (isUpdate.value === false) {
                userResponse = await axios.post(`${backendUrl}/api/purchase/`, datas);
            }
            // Update user
            else {
                userResponse = await axios.put(`${backendUrl}/api/purchase/${userId.value}`, datas);
            }
            if (userResponse.status === 200) {
                if (userResponse.data.uname) {
                    ctx.addIssue({
                        path: ['uname'],
                        message: 'Username already exists.',
                    });
                } else if (userResponse.data.email) {
                    ctx.addIssue({
                        path: ['email'],
                        message: 'Email already exists.',
                    });
                } else {
                    toast.add({ severity: 'success', summary: 'Updated Successfully.', life: 3000 });
                    submitted.value = true;
                    userDialog.value = false;
                }
            }
            if (userResponse.status !== 201) {
                ctx.addIssue({
                    path: ['uname'],
                    message: 'Form incomplete',
                });
            }
        } catch (error) {
            console.log(error);
        }
    })
));

const onFormSubmit = ({ valid }) => {
    if (valid) {
        toast.add({ severity: 'success', summary: 'Updated Successfully.', life: 3000 });
    }
};


const deleteUser = async () => {

    try {
        const response = await axios.delete(`${backendUrl}/api/purchase/${userId.value}`);
        if (response.status === 204) {
            carts.value = carts.value.filter(val => val.id !== userId.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            deleteUserDialog.value = false;
        } else {
            console.error('Failed to delete user');
            toast.add({ severity: 'error', summary: 'Error', detail: 'User Not Deleted', life: 3000 });
        }
    } catch (error) {
        console.error("Client can't delete purchase: ", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'User Not Deleted', life: 3000 });
    }

};

// Delete purchase
const deleteSelectedpurchase = async () => {

    for (const user of carts.value) {
        try {
            console.log(user);
            await axios.delete(`${backendUrl}/api/purchase/${user.id}`);
        } catch (error) {
            console.error(`Failed to delete user with ID: ${user.id}`, error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'user Not Deleted', life: 3000 });
        }
    }
    carts.value = carts.value.filter(val => !carts.value.includes(val));
    deletepurchaseDialog.value = false;
    carts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'purchase Deleted', life: 3000 });

};

// Dialog Operations

const openNew = () => {
    isUpdate.value = false;

    userId.value = null;
    uname.value = null;
    email.value = null;
    password.value = null;
    passwordConfirm.value = null;
    address.value = null;
    selectedCounty.value = null;
    selectedDistrict.value = null;

    submitted.value = false;
    userDialog.value = true;
};

const editUser = async (prod) => {
    isUpdate.value = true;

    userId.value = prod.id;
    uname.value = prod.uname;
    email.value = prod.email;
    password.value = prod.password;
    passwordConfirm.value = prod.password;
    address.value = prod.address.address;
    selectedCounty.value = prod.address.county;
    selectedDistrict.value = prod.address.district;

    console.log(initialValues.value);

    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const confirmDeleteuser = (prod) => {
    userId.value = prod.id;
    deleteUserDialog.value = true;
};

const confirmDeleteSelected = () => {
    deletepurchaseDialog.value = true;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

// Column Utilities

const size = ref({ label: 'Normal', value: 'null' });
const sizeOptions = ref([
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'null' },
    { label: 'Large', value: 'large' }
]);

</script>
<template>
    <div class="mt-5">
        <Card>
            <template #content>
                <h1 class="text-center">Cart Database</h1>
            </template>
        </Card>
        <Toast />
        <div class="mt-4">
            <DataTable ref="dt" v-model:selection="selectedpurchase" :value="carts" dataKey="id" :paginator="true"
                :rows="10" :filters="filters" :size="size.value" stripedRows resizableColumns columnResizeMode="expand"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} purchase">
                <template #header>
                    <div class="flex flex-wrap gap-3 justify-content-center">
                        <Button label="New" icon="pi pi-plus" @click="openNew" />
                        <Button label="Delete" icon="pi pi-trash" severity="danger" outlined
                            @click="confirmDeleteSelected" :disabled="!selectedpurchase || !selectedpurchase.length" />
                        <SelectButton v-model="size" :options="sizeOptions" optionLabel="label" dataKey="label" />
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload
                            chooseLabel="Import" auto :chooseButtonProps="{ severity: 'secondary' }" />
                        <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteuser(slotProps.data)" />
                    </template>
                </Column>

                <Column field="User.uname" header="User" sortable style="min-width: 10rem"></Column>
                <Column field="Product.name" header="Item" sortable style="min-width: 6rem"></Column>
                <Column field="quantity" header="Quantity" sortable style="min-width: 6rem"></Column>
                <Column field="createdAt" header="Created Time" sortable style="min-width: 6rem"></Column>
            </DataTable>
        </div>
    </div>
</template>