import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

import { Button } from "@components/Button";
import { Input } from "@components/Input";


import { AuthNavigatorRoutesProps } from "@routes/auth.routes";


type FormData = {
    email: string;
    password: string;
}

const signInSchema = yup.object({
    email: yup.string().required('Informe o e-mail'),
    password: yup.string().required('Informe a senha'),
});

export function SignIn() {
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(signInSchema)
    })

    function handleNewAccount() {
        navigation.navigate('signUp');
    }

    function handleSignIn({ email, password }: FormData) {
        console.log(email, password)
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>


            <VStack flex={1} px={10} pb={16}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    resizeMode="contain"
                    position="absolute"
                />

                <Center my={24}>
                    <LogoSvg />

                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e o seu corpo.
                    </Text>
                </Center>

                <Center>
                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                        Acesse a conta
                    </Heading>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />



                    <Button title="Acessar" onPress={handleSubmit(handleSignIn)} />
                </Center>


                <Center mt={24}>
                    <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                        Ainda não tem acesso?
                    </Text>

                    <Button title="Criar Conta" variant="outline" onPress={handleNewAccount} />
                </Center>


            </VStack>
        </ScrollView>
    );
}