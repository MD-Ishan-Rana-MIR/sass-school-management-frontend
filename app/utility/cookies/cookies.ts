const COOKIE_EXPIRE_DAYS = 7



export function setCookie7Days(name: string, value: string) {
    const expires = new Date(Date.now() + COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

// Get cookie value
export function getCookie(name: string): string | null {
    const cookies = document.cookie.split("; ").map(c => c.split("="));

    const found = cookies.find(([key]) => key === name)
    return found ? decodeURIComponent(found[1]) : null
}

// Delete cookie
export function removeCookie(name: string) {
    document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/`
}


export function autoLogoutOnCookieExpiry(cookieName: string, redirectTo: string) {
    // Run immediately and then every minute
    const check = () => {
        const token = getCookie(cookieName)
        if (!token) {
            removeCookie(cookieName)
            window.location.href = redirectTo
        }
    }

    check()
    const interval = setInterval(check, 60 * 1000)
    return () => clearInterval(interval) // call this to clean up interval
}