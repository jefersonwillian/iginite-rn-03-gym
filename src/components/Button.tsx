import { Button as ButtonNativeBase, IButtonProps, Spinner, Text } from 'native-base';

type Props = IButtonProps & {
    title: string;
    variant?: 'solid' | 'outline';
    loading?: boolean;
}

export function Button({ title, variant = 'solid', loading = false, ...rest }: Props) {
    return (
        <ButtonNativeBase
            w="full"
            h={14}
            bg={variant === 'outline' ? 'transparent' : 'green.700'}
            borderWidth={variant === 'outline' ? 1 : 0}
            borderColor="green.500"
            rounded="sm"
            _pressed={{
                bg: variant === 'outline' ? 'gray.500' : 'green.500'
            }}
            {...rest}
        >
            {
                loading ?
                    <Spinner color={variant === 'outline' ? 'green.500' : 'white'} /> :
                    <Text
                        color={variant === 'outline' ? 'green.500' : 'white'}
                        fontFamily="heading"
                        fontSize="sm"
                    >
                        {title}
                    </Text>
            }
        </ButtonNativeBase>
    );
}