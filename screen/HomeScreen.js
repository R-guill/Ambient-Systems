import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, Vibration } from "react-native";
import TwoBlackBoxes from "../assets/BlackBoxes";
import Popup from "../assets/PopUp";
import Button from "../assets/Button";
import Footer from "../assets/Footer";
import Header from "../assets/Header";

const HomePage = () => {
  const [leftValue, setLeftValue] = useState(5);
  const [rightValue, setRightValue] = useState(10);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popUpmsg, setPopUpmsg] = useState("Time is up!");
  const [alertState, setalertState] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRightValue((prevRightValue) => {
        if (prevRightValue > 0) {
          return prevRightValue - 1;
        } else {
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (rightValue === 0 && leftValue === 0) {
      return;
    }
    if (rightValue === 0) {
      setLeftValue((prevLeftValue) => prevLeftValue - 1);
      setRightValue(59);
    }
  }, [leftValue, rightValue]);

  useEffect(() => {
    if (leftValue === 0 && rightValue === 0) {
      if (alertState === true) {
        Vibration.vibrate(1000);
      }
      setalertState(false);
      setIsPopupVisible(true);

      setPopUpmsg("La machine à café est libre!");
    }
  }, [leftValue, rightValue]);

  const onClosePopup = () => {
    setIsPopupVisible(false);
  };
  const onButtonPress = () => {
    setalertState(!alertState);
  };

  return (
    <View style={styles.container}>
        <Header text="Ambient Systems" />
      <Text style={styles.text}>Temps d'attente estimé</Text>
      <TwoBlackBoxes leftValue={leftValue} rightValue={rightValue.toString().padStart(2, "0")} />
      <Popup
        isVisible={isPopupVisible}
        message={popUpmsg}
        onClose={onClosePopup}
      />
      <Button onPress={onButtonPress} />
      <View style={styles.imageContainer}>
        {alertState && (
          <Image
            source={require("../assets/belltransparent.gif")}
            style={styles.gif}
          />
        )}
        {!alertState && (
          <Image source={require("../assets/lounge.gif")} style={styles.gif} />
        )}
      </View>
      <Footer text="Copyright © 2023 Techl@b" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  imageContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom:0,
  },
  gif: {
    width: "100%",
    height: "100%",
  },
});

export default HomePage;
