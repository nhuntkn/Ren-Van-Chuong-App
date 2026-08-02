export const ROLE_COOKIE = "kho_role";

export function setRoleCookie(role) {
    document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

export function clearRoleCookie() {
    document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}