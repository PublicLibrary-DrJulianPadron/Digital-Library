import api from "@/common/api/axios";

export const signUp = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const res = await api.post("/users/", data); // Adjust endpoint if needed
  return res.data;
};

export const logIn = async (email: string, password: string) => {
  const res = await api.post("/token/", { email, password }); // standard DRF JWT endpoint
  return res.data; // { access, refresh }
};
