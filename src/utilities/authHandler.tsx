export const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
}