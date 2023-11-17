const API_BASE_URL = 'http://localhost:8000'

/**
 * 
 * @param {int} round  
 */
export async function fetchWords(roundNumber) {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-words`, { params: { round: roundNumber } });
        return response.data;
    } catch (err) {
        // We'll need better error handling
        console.error('Error fetching game data: ', error);
        return { theme: '', words: [] }
    }
}

/**
 * 
 * @param {string} themeId 
 * @param {string[]} words 
 */
export async function submitAnswer(themeId, words) {
    try {
        const response = await axios.post(`${API_BASE_URL}/check-match`, {
            themeId,
            words
        });
        return response.data;
        // Shape of response.data
        // {
        //     isCorrect: boolean,
        //     theme?: string // the theme name
        // }
    } catch (err) {
        console.error('Error submitting answer:', err);
        throw err;
    }
}