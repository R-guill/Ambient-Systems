import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import TwoBlackBoxes from "../assets/BlackBoxes";
import Popup from "../assets/PopUp";
import Button from "../assets/Button";

const HomePage = () => {
  const [leftValue, setLeftValue] = useState(0);
  const [rightValue, setRightValue] = useState(10);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popUpmsg, setPopUpmsg] = useState("Time is up!");

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
      setIsPopupVisible(true);
      setPopUpmsg("La machine à café est libre!");
    }
  }, [leftValue, rightValue]);

  const onClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Temps d'attente estimé</Text>
      <TwoBlackBoxes leftValue={leftValue} rightValue={rightValue} />
      <Popup isVisible={isPopupVisible} message={popUpmsg} onClose={onClosePopup} />
        <Button />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#312403",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default HomePage;
