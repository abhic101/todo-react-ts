import styles from './ErrorPanel.module.css';

const defaultMessage = {
    profileNotFound: "No user profile found !",
    connectionIssue: 'Cannot connect to internet...',
    serverBusy: 'Server busy! Please try again later...',
    underMaintainence: 'This feature is under maintainence...'
}

const imageName: typeof defaultMessage = {
    profileNotFound: 'profile-not-found.webp',
    connectionIssue: 'no-connection.webp',
    serverBusy: 'server-busy.webp',
    underMaintainence: 'under-maintainence.webp'
}

type Props = {
    kind: keyof typeof defaultMessage;
    message?: string
}

function ErrorPanel({kind, message}: Props) {
    console.log(kind);
    const imagePath = new URL('../../../assets/' + imageName[kind], import.meta.url).href ;
    let m: string;
    if (message) {
        m = message;
    }
    m = defaultMessage[kind];
    
    return (
        <div className={styles['error-panel']}>
                <img className={styles['icon']} src={imagePath} loading='lazy' />
                <p className={styles['message']}>{m}</p>
        </div>
    )
}

type AvailableKind = keyof typeof defaultMessage;

export default ErrorPanel;
export type {
    AvailableKind
}