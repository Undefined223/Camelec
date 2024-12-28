export const getToken = () => {
    if (typeof window !== 'undefined') {  // Check if running on the client-side
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
        return userInfo?.token || null;
    }
    return null;  // Return null if on the server-side
};
