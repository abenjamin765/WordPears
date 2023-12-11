import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_ENV === 'local' ? process.env.REACT_APP_LOCAL_BACKEND : process.env.REACT_APP_API_BASE_URL
});

/**
 * @returns data is array of strings which represent a game with a single solution 
 */
export const getWords = async (round = 1) => {
    try {
        const res = await instance.get('/words', { params: { round } })
        return { success: true, data: res.data }
    } catch (err) {
        console.error('getWords API error', err);
        return { success: false };
    }
}