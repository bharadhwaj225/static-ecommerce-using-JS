export const requireAuth = () => {
    if (!localStorage.getItem('loggedInUser')) {
        window.location.href = 'login.html';
    }
};

export const getUser = () => localStorage.getItem('loggedInUser');

export const logout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
};
