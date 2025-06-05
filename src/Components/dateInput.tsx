import React, { useState } from "react";
import { View, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateInput = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [displayDate, setDisplayDate] = useState<string>("");

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString("pt-BR");
      setDisplayDate(formattedDate);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
    console.log("showPicker set to true");
  };

  return (
    <View>
      <TextInput
        label="Data da ocorrencia"
        mode="outlined"
        value={displayDate}
        placeholder="Selecione uma data"
        editable={false}
        right={<TextInput.Icon icon="calendar" onPress={showDatePicker} />}
        style={{
          backgroundColor: "white",
          borderColor: "black",
        }}
        theme={{
          colors: {
            primary: "white",
            placeholder: "black",
          },
        }}
      />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

export default DateInput;
