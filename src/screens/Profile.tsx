import {
    Center,
    Heading,
    KeyboardAvoidingView,
    ScrollView,
    Skeleton,
    Text,
    VStack,
    useToast,
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";

import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";

import { useAuth } from "@hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import defaulUserPhotoImg from '@assets/userPhotoDefault.png';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
};

const profileSchema = yup.object({
    name: yup.string().required("Informe o nome"),
    password: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 dígitos.")
        .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
        .matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial")
        .nullable()
        .transform((value) => (!!value ? value : null)),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => (!!value ? value : null))
        .oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
        .when("password", {
            is: (Field: string) => Field,
            then: (schema) =>
                schema.nullable().required("Informe a confirmação da senha.").transform((value) => !!value ? value : null)
        }),
});

const PHOTO_SIZE = 33;

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    
    const [isUpdating, setIsUpdating] = useState(false);

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema),
    });

    async function handleUserPhotoSelected() {
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (photoSelected.canceled) {
                return;
            }

            if (photoSelected.assets.length) {
                const photoInfo: any = await FileSystem.getInfoAsync(
                    photoSelected.assets[0].uri,
                    { size: true, md5: true }
                );

                if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                    return toast.show({
                        title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
                        placement: "top",
                        bgColor: "red.500",
                    });
                }


                const fileExtension = photoSelected.assets[0].uri.split('.').pop();

                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase(),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                const userPhotoUploadForm = new FormData();

                userPhotoUploadForm.append('avatar', photoFile);

                const avatarUpdtedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
          
                const userUpdated = user;

                userUpdated.avatar = avatarUpdtedResponse.data.avatar;

                await updateUserProfile(userUpdated);

                toast.show({
                    title: 'Foto atualizada!',
                    placement: 'top',
                    bgColor: 'green.500'
                })
            }
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar a foto. Tente novamente mais tarde.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setTimeout(() => {
                toast.closeAll();
                setPhotoIsLoading(false);
            }, 2000);
          
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;

            await api.put('/users', data);

            await updateUserProfile(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <KeyboardAvoidingView behavior="position">


                    <Center mt={6} px={10}>
                        {photoIsLoading ? (
                            <Skeleton
                                w={PHOTO_SIZE}
                                h={PHOTO_SIZE}
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.400"
                            />
                        ) : (
                            <UserPhoto
                                source={user.avatar ? { uri: `${api.defaults.baseURL + '/avatar/' + user.avatar}` } : defaulUserPhotoImg}
                                alt="Foto do usuário"
                                size={PHOTO_SIZE}
                                resizeMode="cover"
                            />

                        )}
                        <TouchableOpacity onPress={handleUserPhotoSelected}>
                            <Text
                                color="green.500"
                                fontWeight="bold"
                                fontSize="md"
                                mt={2}
                                mb={8}
                            >
                                Alterar Foto
                            </Text>
                        </TouchableOpacity>

                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    bg="gray.600"
                                    placeholder="Nome"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    bg="gray.600"
                                    placeholder="E-mail"
                                    isDisabled
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                    </Center>
                    <VStack px={10} mt={5} mb={9}>
                        <Heading
                            color="gray.200"
                            fontSize="md"
                            mb={2}
                            alignSelf="flex-start"
                            fontFamily="heading"
                        >
                            Alterar senha
                        </Heading>

                        <Controller
                            control={control}
                            name="old_password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    bg="gray.600"
                                    placeholder="Senha antiga"
                                    secureTextEntry
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    bg="gray.600"
                                    placeholder="Nova senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirm_password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    bg="gray.600"
                                    placeholder="Confirme a nova senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.confirm_password?.message}
                                    onSubmitEditing={handleSubmit(handleProfileUpdate)}
                                    returnKeyType="send"
                                />
                            )}
                        />

                        <Button
                            title="Atualizar"
                            mt={4}
                            onPress={handleSubmit(handleProfileUpdate)}
                            isLoading={isUpdating}
                        />
                    </VStack>
                </KeyboardAvoidingView>
            </ScrollView>
        </VStack>
    );
}
