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

/**
 * @param {Object} input
 * @param {string} input.theme
 * @param {Array.<string>} input.words
 * 
 * @return {{ success: Boolean, isCorrect?: Boolean }}
 */
// export const checkWords = async (input) => {
//     try {
//         console.log(input)
//         const { data } = await instance.post('/check-match', input);
//         return { success: true, isCorrect: data.isCorrect }
//     } catch (err) {
//         console.error('checkWords API error', err);
//         return { success: false }
//     }
// }

export async function checkWords(input) {
    try {
        console.log(input)
        const { data } = await instance.post('/check-match', input);
        return { success: true, isCorrect: data.isCorrect }
    } catch (err) {
        console.error('checkWords API error', err);
        return { success: false }
    }
}