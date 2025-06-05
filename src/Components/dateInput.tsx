import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateInput = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [displayDate, setDisplayDate] = useState('');

interface DateInputChangeEvent {
    type: string;
    nativeEvent: {
        timestamp: number;
    };
}

const onChange = (
    event: DateInputChangeEvent | undefined,
    selectedDate?: Date | undefined
) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);

    // Formatar a data para exibição
    const formattedDate = currentDate.toLocaleDateString('pt-BR');
    setDisplayDate(formattedDate);
};

  return (
    <View>
      <TextInput
        label="Data"
        mode="outlined"
        value={displayDate}
        placeholder="Selecione uma data"
        editable={false}
        right={<TextInput.Icon 
          icon="calendar" 
          onPress={() => setShowPicker(true)} 
        />}
        theme={{ 
          colors: { 
            primary: 'black',
            placeholder: 'gray'
          } 
        }}
      />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          locale="pt-BR" // Configuração para português brasileiro
        />
      )}
    </View>
  );
};

export default DateInput;