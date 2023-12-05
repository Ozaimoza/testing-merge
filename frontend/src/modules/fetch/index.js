import { instance } from "../axios/index";

async function getAllWarehouses() {
  try {
    const response = await instance.get("/admin/warehouse");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
}
async function createWarehouse(data) {
  try {
    // console.log(data);
    const response = await instance.post("/admin/warehouse", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
}

async function getWarehouseById(id) {
  try {
    const response = await instance.get(`/admin/warehouse/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
}

async function editWarehouse(id, data) {
  try {
    const response = await instance.put(`/admin/warehouse/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
}

async function deleteWarehouse(id) {
  try {
    const response = await instance.delete(`/admin/warehouse/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.massage || "Something went wrong");
  }
}

async function getAllCategories() {
  try {
    const response = await instance.get("/admin/category");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
}

async function createCategory(data) {
  try {
    // console.log(data);
    const response = await instance.post("/admin/category", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
}

async function editCategory(id, category_name) {
  try {
    const response = await instance.put(`/admin/category/${id}`, {
      category_name,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
}

async function deleteCategory(id) {
  try {
    const response = await instance.delete(`/admin/category/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.massage || "Something went wrong");
  }
}

export {
  getAllWarehouses,
  createWarehouse,
  getWarehouseById,
  deleteWarehouse,
  getAllCategories,
  createCategory,
  editCategory,
  deleteCategory,
  editWarehouse,
};
