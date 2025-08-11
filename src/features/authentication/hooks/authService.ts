import api from "@/common/api/axios";

export const signUp = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const res = await api.post("/users/register/", data); // Adjust endpoint if needed
  return res.data;
};

export const logIn = async (username: string, password: string) => {
  const res = await api.post("/token/", { password, username }); // standard DRF JWT endpoint
  return res.data; // { access, refresh }
};
