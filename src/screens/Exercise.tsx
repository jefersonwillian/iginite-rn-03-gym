import { Center, HStack, Heading, Text, Image, Box, ScrollView } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Icon, VStack } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';


import BodySvg from '@assets/body.svg';

import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from '@components/Button';

type RouteParamsProps = {
    exerciseId: string;
}

export function Exercise() {

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const route = useRoute();

    const { exerciseId } = route.params as RouteParamsProps;
    console.log("🚀 ~ file: Exercise.tsx:26 ~ Exercise ~ exerciseId:", exerciseId)
    
    function handleGoBack() {
        navigation.goBack();
    }

    return (
        <VStack flex={1}>

            <VStack px={8} bg="gray.600" pt={12}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon
                        as={Feather}
                        name="arrow-left"
                        color="green.500"
                        size={6}
                    />
                </TouchableOpacity>
                <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
                    <Heading color="gray.100" fontSize="lg" flexShrink={1} numberOfLines={1} fontFamily="heading">
                        Puxada frontala
                    </Heading>

                    <HStack alignItems="center">
                        <BodySvg />

                        <Text color="gray.200" ml={1} textTransform="capitalize">
                            Costas
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            <ScrollView>
                <VStack p={8}>
                    <Image
                        w="full"
                        h={80}
                        source={{ uri: 'https://cdn.fisiculturismo.com.br/monthly_2017_03/puxada-pela-frente-pronada-final-media.jpg.08db59d9f9355297aebe54ee8b981953.jpg' }}
                        alt="Nome do exercício"
                        mb={3}
                        resizeMode="cover"
                        rounded="lg"
                    />

                    <Box bg="gray.600" rounded="md" pb={4} px={4}>
                        <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                            <HStack>
                                <SeriesSvg />
                                <Text color="gray.200" ml="2">
                                    3 séries
                                </Text>
                            </HStack>

                            <HStack>
                                <RepetitionsSvg />
                                <Text color="gray.200" ml="2">
                                    12 repetições
                                </Text>
                            </HStack>
                        </HStack>

                        <Button
                            title="Marcar como realizado"
                        />
                    </Box>
                </VStack>
            </ScrollView>
        </VStack>
    );
}