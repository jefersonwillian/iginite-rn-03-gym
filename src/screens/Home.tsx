import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { VStack } from 'native-base';

export function Home() {
    return (
        <VStack flex={1}>
            <HomeHeader />

            <Group name="Costas" />

            <Group name="Costas 1" />
        </VStack>
    );
}