import { useEffect, type ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary'
import * as FocusScope from '@radix-ui/react-focus-scope';
import { RemoveScroll } from 'react-remove-scroll';
import styles from './CenterModal.module.css'

const BOUNDARY_ERROR_TIMEOUT = 2000;

interface Props {
    closeRequested: boolean;
    onClose:() => void;
    children: ReactNode;
}

/** Generic modal (dialog that restricts outside interaction) wrapper.
 *  Will be rendered as child of html.body
 */
function CenterModal({closeRequested, onClose, children}: Props) {

    // Add listener for escape key to close the modal
    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape')
                onClose();
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [children])


    async function onErrorClose() {
        await new Promise(resolve => setTimeout(resolve, BOUNDARY_ERROR_TIMEOUT));
        onClose();
    }


    function getClassName(element: 'overlay' | 'panel') {
        if (!closeRequested) return `${styles[element]}`;
        return `${styles[element + '-' + 'close']}`
    }

    // Use react portal to render this component as child of dom.body
    return (
        <div className={getClassName('overlay')} onClick={(e) => {e.stopPropagation()}}>
            <RemoveScroll className={styles['panel-container']}>

                    <FocusScope.Root trapped loop asChild>
                        <div className={getClassName('panel')} onClick={(e) => e.stopPropagation()}>
                            
                            <div className={styles['close-button-container']}><button onClick={onClose} tabIndex={-1}>x</button></div>
                            
                            <ErrorBoundary
                                fallback={<p className={styles['error-boundary-message']}><span className={styles['error-span']}>🚧</span>&nbsp; Under Construction &nbsp;<span className={styles['error-span']}>🚧</span></p>}
                                onError={(error, info) => {
                                    console.log('Logged: ', error.message, info.componentStack);
                                    onErrorClose();
                                }}>
                                {children}
                            </ErrorBoundary>
                        </div>
                    </FocusScope.Root>
            </RemoveScroll>
        </div>
    )
}

export default CenterModal;
export type {
    Props
}