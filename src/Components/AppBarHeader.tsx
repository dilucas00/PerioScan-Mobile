import React from "react";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";

type AppBarHeaderProps = {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
};

const AppBarHeader: React.FC<AppBarHeaderProps> = ({
  title,
  showBack = false,
  actions,
}) => {
  const router = useRouter();

  return (
    <Appbar.Header
      style={{
        backgroundColor: "#000",
        elevation: 0,
        shadowOpacity: 0,
        height: 70,
      }}
    >
      {showBack && (
        <Appbar.BackAction color="#FFF" onPress={() => router.back()} />
      )}
      <Appbar.Content
        title={title}
        titleStyle={{
          color: "#FFF",
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
        }}
      />
      {actions}
    </Appbar.Header>
  );
};

export default AppBarHeader;
