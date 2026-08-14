import type { IconType } from 'react-icons';
import { RiFacebookFill } from "react-icons/ri";
import { RiTwitterFill } from "react-icons/ri";
import { RiGithubLine } from "react-icons/ri";
import { RiPhoneFill } from "react-icons/ri";
import { RiAtFill } from "react-icons/ri";


// Types being used in footer and its childrens
// export interface Social {
//     name: string;
//     label: string;
//     link: string;
//     iconURL?: string;
// }

export interface Social {
    name: string;
    label: string;
    link: string;
    iconURL?: IconType;
}
export interface Contact {
    name: string;
    label: string;
    link: string;
    iconURL?: IconType;
}

export const socialsLiterals: Social[] = [
    { name: 'facebook', label: 'Facebook', link: 'https://www.facebook.com', iconURL: RiFacebookFill },
    { name: 'twitter', label: 'Twitter', link: 'https://www.twitter.com', iconURL: RiTwitterFill },
    { name: 'github', label: 'Github', link: 'https://www.github.com', iconURL: RiGithubLine }
]

export const contactsLiterals: Contact[] = [
    { name: 'email', label: 'Email', link: 'mailto:temporary-mail@google.com', iconURL: RiAtFill },
    { name: 'phone', label: 'Phone', link: 'tel:+11234567891', iconURL: RiPhoneFill },
]

// export interface Contact {
//     name: string;
//     label: string;
//     link: string;
//     iconURL?: string;
// }

/** Social media data to be displayed */
// export const socialsLiterals: Social[] = [
//     { name: 'facebook', label: 'Facebook', link: 'https://www.facebook.com', iconURL: new URL('../../assets/icons/facebook-icon.svg', import.meta.url).href },
//     { name: 'twitter', label: 'Twitter', link: 'https://www.twitter.com', iconURL: new URL('../../assets/icons/twitter-icon.svg', import.meta.url).href },
//     { name: 'github', label: 'Github', link: 'https://www.github.com', iconURL: new URL('../../assets/icons/github-icon.svg', import.meta.url).href }
// ]

/** Contact info data to be displayed */
// export const contactsLiterals: Contact[] = [
//     { name: 'email', label: 'Email', link: 'mailto:temporary-mail@google.com', iconURL: new URL('../../assets/icons/mail-icon.svg', import.meta.url).href },
//     { name: 'phone', label: 'Phone', link: 'tel:+11234567891', iconURL: new URL('../../assets/icons/phone-icon.svg', import.meta.url).href },
// ]

// export {
//     socialsLiterals,
//     contactsLiterals
// }

// export type {
//     Social,
//     Contact
// }