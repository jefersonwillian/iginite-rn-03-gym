import { Loading } from "@components/Loading";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Center, NativeBaseProvider } from "native-base";
import { StatusBar } from "react-native";

import { THEME } from "./src/theme";

import { Routes } from "@routes/index";
import { AuthContext } from "@contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <AuthContext.Provider value={{
        user: {
          id: '1',
          name: 'Jeferson Carvalho',
          email: 'jeferson@email.com',
          avatar: 'jeferson.png'
        }
      }}>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContext.Provider>
    </NativeBaseProvider>
  );
}
