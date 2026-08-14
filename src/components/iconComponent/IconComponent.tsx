import type {IconType, IconBaseProps} from 'react-icons';

interface Props extends IconBaseProps {
    icon: IconType;
}

function IconComponent ({icon, ...rest}: Props) {
    const ActualIcon = icon;

    return (
        <ActualIcon {...rest}></ActualIcon>
    )
}

export default IconComponent;