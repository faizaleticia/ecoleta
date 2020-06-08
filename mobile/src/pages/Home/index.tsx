import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface Picker {
  label: string;
  value: string;
}

const Home = () => {
  const [ ufs, setUfs ] = useState<Picker[]>([]);
  const [ cities, setCities ] = useState<Picker[]>([]);

  const [ selectedUf, setSelectedUf ] = useState('0');
  const [ selectedCity, setSelectedCity ] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const ufInitials = response.data.map(uf => { 
          return { 
            label: uf.sigla, 
            value: uf.sigla, 
          };
        });
        setUfs(ufInitials);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((response) => {
        const cityNames = response.data.map(city => {
          return {
            label: city.nome,
            value: city.nome,
          } 
        });
        setCities(cityNames);
      })
      .catch((error) => console.log(error));
  }, [ selectedUf ]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  function handleSelectUf(uf: string) {
    setSelectedUf(uf);
  }

  function handleSelectCity(city: string) {
    setSelectedCity(city);
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
    >
      <ImageBackground 
        source={ require('../../assets/home-background.png') } 
        style={ styles.container }
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={ styles.main }>
          <Image source={ require('../../assets/logo.png') } />
          <View>
            <Text style={ styles.title }>Seu marketplace de coleta de resíduos.</Text>
            <Text style={ styles.description }>Ajudamos pessoal a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>
        <View style={ styles.footer }>

          <RNPickerSelect
              placeholder={{
                label: 'Selecione a UF',
                value: '',
              }}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 10,
                  right: 12,
                },
              }}
              onValueChange={ (uf) => handleSelectUf(uf) }
              items={ ufs }
          />

          <RNPickerSelect
              placeholder={{
                label: 'Selecione a Cidade',
                value: '',
              }}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 10,
                  right: 12,
                },
              }}
              onValueChange={ (city) => handleSelectCity(city) }
              items={ cities }
          />

          <RectButton style={ styles.button } onPress={ handleNavigateToPoints }>
            <View style={ styles.buttonIcon }>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={ 24 }></Icon>
              </Text>
            </View>
            <Text style={ styles.buttonText }>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16, //  // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;