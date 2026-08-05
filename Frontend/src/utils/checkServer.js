import axios from "axios";
import {baseURL} from "../components/api"
export const checkServer = async () => {
    try {
        await axios.get(`${baseURL}/health`, {
            timeout: 3000,
        });

        return true;
    } catch {
        return false;
    }
};