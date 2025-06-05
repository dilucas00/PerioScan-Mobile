import React from 'react';
import { Modal, Portal, Text, TextInput, Menu, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import DateInput from './dateInput';


type NovoCasoModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (data: { titulo: string; tipo: string }) => void;
};


const NovoCasoModal: React.FC<NovoCasoModalProps> = ({ visible, onDismiss, onConfirm }) => {
  const [titulo, setTitulo] = React.useState('');
  const [localizacao, setLocalizacao] = React.useState('');	
  const [tipoCaso, setTipoCaso] = React.useState('');
  const [menuVisible, setMenuVisible] = React.useState(false);

  const tiposCaso = [
    "Exame Criminal",
    "Identificação de Vítima",
    "Acidente",
    "Outros"
  ];

  const handleConfirm = () => {
    onConfirm({ titulo, tipo: tipoCaso });
    setTitulo('');
    setTipoCaso('');
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar Novo Caso</Text>
        
        <TextInput
          label="Título do caso"
          mode="outlined"
          value={titulo}
          onChangeText={setTitulo}
          keyboardType="default"
          theme={{ 
            colors: { 
              primary: 'black',   
              outline: 'black',  
            } 
          }}
          style={styles.input}
        />
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TextInput
              label="Tipo do caso"
              mode="outlined"
              value={tipoCaso}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="menu-down" onPress={() => setMenuVisible(true)} />}
              theme={{ 
                colors: { 
                  primary: 'black',
                  outline: 'black',
                  placeholder: 'black'
                } 
              }}
            style={styles.input}
            placeholderTextColor="gray"
            />
          }>
          {tiposCaso.map((tipo) => (
            <Menu.Item
              key={tipo}
              onPress={() => {
                setTipoCaso(tipo);
                setMenuVisible(false);
              }}
              title={tipo}
            />
          ))}
        </Menu>
         <TextInput
          label="Localização do caso"
          mode="outlined"
          value={localizacao}
          onChangeText={setLocalizacao}
          keyboardType="default"
          theme={{ 
            colors: { 
              primary: 'black',   
              outline: 'black',  
            } 
          }}
          style={styles.input}
        />
        <DateInput />

        <View style={styles.buttons}>
          <Button 
            mode="outlined" 
            onPress={onDismiss}
            style={styles.button}
            textColor="#000"
          >
            Cancelar
          </Button>
          <Button 
            mode="contained" 
            onPress={handleConfirm}
            style={styles.button}
            buttonColor="#000"
            textColor="#FFF"
          >
            Confirmar
          </Button>
        </View>
        
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', 
    padding: 20, 
    margin: 20, 
    borderRadius: 8
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 15
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    marginLeft: 10,
  },
});

export default NovoCasoModal;