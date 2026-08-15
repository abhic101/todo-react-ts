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
            <p className={styles['footer-contact-card-title']}>{title}</p>
{/* Mapping of Footer card items */}
            {list.map((list) => {
                return (
                    <div className={styles['footer-contact-card-item']} key={list.name}>
                        <a href={list.link} target='_blank'>
                            <IconComponent icon={list.iconURL ? list.iconURL : Fallback} />
                            <p className={styles['footer-contact-card-item-label']}>{list.label}</p>
                        </a>
                    </div>
                )
            })}
        </div>
    )
}

export default FooterCard;