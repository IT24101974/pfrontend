import axios from "axios";

const API = axios.create({
  baseURL: "https://pbackend-production-3c2c.up.railway.app/api",  // ← Railway URL eka මෙතන දාන්න
});

export const fetchItems = () => API.get("/items");
export const fetchItemById = (id) => API.get(`/items/${id}`);
export const createItem = (data) => API.post("/items", data);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
