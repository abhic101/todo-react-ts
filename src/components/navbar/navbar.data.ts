// Each navlink required info type
interface NavLink {
    name: string;
    label: string;
    link?: string;
    visible: boolean;
}

/**Static data of navigation links group for logged in users*/
const loggedInNavLinks: NavLink[] = [
    { name: 'settings', label: 'Settings', visible: true },
    { name: 'logout', label: 'Logout', visible: true }
]

/**Static data of navigation links group for logged out users*/
const loggedOutNavLinks: NavLink[] = [
    { name: 'login', label: 'Login', link: '#', visible: true},
    { name: 'signup', label: 'Signup', link: '@', visible: true }
]

export {
    loggedInNavLinks,
    loggedOutNavLinks
}

export type {
    NavLink
}