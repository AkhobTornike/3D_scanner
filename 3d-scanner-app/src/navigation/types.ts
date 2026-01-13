import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Processing: {
        videoPath: string;
    };
    Preview: {
        modelId: string;
        modelPath: string;
    };
    Gallery: undefined;
};

export type StackNavigation<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

export type StackRoute<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;

export type ScreenProps<T extends keyof RootStackParamList> = {
    navigation: StackNavigation<T>;
    route: StackRoute<T>;
}