import axios from "axios";
import { BASE_URL } from "./globalConstant.ts";

const axiosApi = axios.create({
  baseURL: BASE_URL,
});

//                          INTERCEPTORS
// export const addInterceptors = (store: Store<RootState>) => {
//     axiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//         const token = store.getState().users.user?.token;
//         const headers = config.headers as AxiosHeaders;
//         headers.set('Authorization', token);
//
//         return config
//     });
// };

export default axiosApi;
