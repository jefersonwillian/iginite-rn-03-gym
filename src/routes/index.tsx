import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useTheme, Box } from 'native-base';

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

export function Routes() {
    const { colors } = useTheme();

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[700];

    const user = false;

    return (
        <Box flex={1} bg="gray.700">
            <NavigationContainer theme={theme}>
                {user ? <AppRoutes /> : <AuthRoutes />}
            </NavigationContainer>
        </Box>
        
    );
}