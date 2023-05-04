import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useTheme, Box } from 'native-base';

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useContext } from "react";
import { AuthContext } from "@contexts/AuthContext";

import { useAuth } from '@hooks/useAuth';

export function Routes() {
    const { colors } = useTheme();

    const { user } = useAuth();

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[700];

    console.log("USUÁRIO LOGADO =>", user);

    return (
        <Box flex={1} bg="gray.700">
            <NavigationContainer theme={theme}>
                {user ? <AppRoutes /> : <AuthRoutes />}
            </NavigationContainer>
        </Box>

    );
}