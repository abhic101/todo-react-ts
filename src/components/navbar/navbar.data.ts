// Each navlink required info type
interface NavLink {
    name: string;
    label: string;
    link?: string;
    visible: boolean;
}

/**Static data of navigation links group for logged in users*/
const userNavLinks: NavLink[] = [
    { name: 'settings', label: 'Settings', visible: true },
    { name: 'logout', label: 'Logout', visible: true }
]

/**Static data of navigation links group for logged out users*/
const guestNavLinks: NavLink[] = [
    { name: 'login', label: 'Login', link: '#', visible: true},
    { name: 'signup', label: 'Signup', link: '@', visible: true }
]

export {
    userNavLinks,
    guestNavLinks
}

export type {
    NavLink
}