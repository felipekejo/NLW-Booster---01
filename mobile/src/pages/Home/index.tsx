import React, { useState, useEffect} from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View , Image, StyleSheet, Text, ImageBackground,  KeyboardAvoidingView, Platform, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation  } from '@react-navigation/native'
import axios from 'axios'


interface IBGEUFResponse{
  sigla: string;
};

interface IBGECityResponse{
  nome: string;
};


const Home = () => {

  const navigation = useNavigation();

  const [ city, setCity] = useState<string[]>([])
  const [uf, setUf] = useState<string[]>([])

  const [initials, setInitials] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUF, setSelectedUF] = useState('Selecione uma UF')
  const [selectedCity, setSelectedCity] = useState('Selecione uma cidade')



  // const Select = Picker.Item as any;

  // function handleSelectUf(uf:string){
  //   // const uf= event.target.value
  //   console.log(uf)
  //   setSelectedUF(uf);
  // }
  // function handleSelectCity(city:string) {
  //   // const city = event.target.value
  //   console.log(city)
  //   setSelectedCity(city);
  // }

  function handleNavigateToPoints() {
    navigation.navigate('Points',{
      uf,
      city
    })
  
  }
  

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla).sort();

        setInitials(ufInitials)
      })
  }, []);

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }
    axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
    .then(response => {
      const cityNames = response.data.map(city => city.nome).sort();

      setCities(cityNames);
    });
  }, [selectedUF]);

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : "padding"} >
    
      <ImageBackground 
        source={require('../../assets/home-background.png')}  
        style= {styles.container}
        imageStyle={{width:274, height:368}}
      >
        <View style={styles.main}>
          <Image source={ require('../../assets/logo.png')}/>
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de Resíduos </Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coletade forma eficiente.</Text>
          </View>  
        </View>
        <View style={styles.footer}>
    
        
          <Picker
            selectedValue={selectedUF}
            enabled={initials !== []}
            style={styles.input}
            onValueChange={(itemValue) => {setSelectedUF(itemValue); setUf(itemValue)}}
          >
            <Picker.Item label='Selecione uma UF' value='0'/>
            {initials.map((uf) => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>

        
        {selectedUF && (
          <Picker
            selectedValue={selectedCity}
            enabled={selectedUF !== ''}
            style={styles.input}
            onValueChange={(itemValue) =>{ setSelectedCity(itemValue); setCity(itemValue)}}
          >
            <Picker.Item label='Selecione uma cidade' value='0'/>
            {cities.map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        )}
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    
    </KeyboardAvoidingView>
    
    
  );
};

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