import type { Contact, Social } from './footer.data'
import { IconComponent } from '@components';
import styles from './Footer.module.css';
import { RiFacebookBoxFill as Fallback } from 'react-icons/ri';

// Props type
interface Props {
    title: string,
    list: Contact[] | Social[]
}

/**
 * @param {Props} props Title of the card and list of items inside card 
 * @returns Footer Card jsx
 */
function FooterCard({title, list}: Props) {
    

    return (
        <div className={styles["footer-contact-card"]}>
            <p className={styles['card-title']}>{title}</p>
            <div className={`${styles['card-items-container']}`} >
    {/* Mapping of Footer card items */}
                {list.map((items) => {
                    return (
                        <a key={items.name} href={items.link} className={styles['card-item']} target='_blank'>
                            <IconComponent icon={items.iconURL ? items.iconURL : Fallback} />
                            <p className={styles['card-item-label']}>{items.label}</p>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default FooterCard;