import { useState } from 'react';
import FooterCard from './FooterCard';
import { contactsLiterals, socialsLiterals } from './footer.data';
import styles from './Footer.module.css';

/**
 * Stateless component. Memoize it to avoid re-render.
 */
function Footer() {
    
    const [socials] = useState(socialsLiterals);
    const [contacts] = useState(contactsLiterals);
    
    return (
        <footer>
            <div className={styles["footer-main"]}>
                <div className={styles['vertical-group']} >
                    <FooterCard title={'Socials'} list={socials} />
                    <FooterCard title={'Contact Us'} list={contacts} />
                </div>
                <div className={styles["author"]}>Made by Drago</div>
            </div>
        </footer>
    )
}

export default Footer;