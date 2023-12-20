//@ts-nocheck
import React, { useState } from "react";
import { View, ImageBackground } from "react-native";
import { TextInput, Button } from "react-native-paper";

import OTPInput from "../components/ResetPassword/OTPInput";
import Reset from "../components/ResetPassword/Reset";
import EmailInput from "../components/ResetPassword/EmailInput";

function App() {
  const [variables, setVariables] = useState({
    page: "",
    email: "",
    otp: "",
  });

  function handleChange(name, value) {
    setVariables((prevVariables) => ({
      ...prevVariables,
      [name]: value,
    }));
    console.log(variables);
  }

  function NavigateComponents() {
    if (variables.page === "OTPInput") return <OTPInput handleChange={handleChange} variables={variables} />;
    if (variables.page === "reset") return <Reset variables={variables} />;
    return <EmailInput handleChange={handleChange} variables={variables} />;
  }

  return (
    <ImageBackground
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      source={require("../assets/images/wave-bg.png")}
    >
      <View style={{ width: "100%" }}>
        <NavigateComponents />
      </View>
    </ImageBackground>
  );
}

export default App;
