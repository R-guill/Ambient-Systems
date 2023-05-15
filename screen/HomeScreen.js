import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Image, Vibration } from "react-native";
import TwoBlackBoxes from "../assets/BlackBoxes";
import Popup from "../assets/PopUp";
import Button from "../assets/Button";
import Footer from "../assets/Footer";
import Header from "../assets/Header";
import { Client } from "paho-mqtt";
import waitTime from "../assets/WaitTime";
import PersonBox from "../assets/PersonBox";

const HomePage = () => {
  const [leftValue, setLeftValue] = useState(1);
  const [rightValue, setRightValue] = useState(30);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popUpmsg, setPopUpmsg] = useState("Time is up!");
  const [alertState, setalertState] = useState(false);
  const [peopleInQueue, setPeopleInQueue] = useState(0);
  const latestMessage = useRef(null);
  
  
  
  useEffect(() => {
    const client = new Client("ws://broker.emqx.io:8083/mqtt", "clientId");

    function onConnect() {
      console.log("Connected to MQTT broker");
      client.subscribe("CoffeeRush");
      console.log("Subscribed to topic");
      client.publish("CoffeeRush", "Subscribed to topic from react native");
    }

    function onMessageArrived(message) {
      latestMessage.current = message.payloadString;
      console.log("Received message:", latestMessage.current);
      //client.publish("Coffee Rush", "Received message from react native");
      setPeopleInQueue(parseInt(latestMessage.current)); 
      
     
      
    }
    
    
    client.onMessageArrived = onMessageArrived;
    client.connect({
      onSuccess: onConnect,
    });
    
    

    

    return () => {
      client.disconnect();
    };
   }, []);

   useEffect(() => {
    console.log("peopleInQueue",peopleInQueue);
    const [min,sec]=waitTime(peopleInQueue);
    setLeftValue(min);
    setRightValue(sec);
  }, [peopleInQueue]);
  

  

  

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
      <Header text="Coffee Rush" />
      <Text style={styles.text}>Temps d'attente estimé</Text>
      <PersonBox nbPeople={peopleInQueue} />
      <TwoBlackBoxes
        leftValue={leftValue}
        rightValue={rightValue.toString().padStart(2, "0")}
      />
      <Popup
        isVisible={isPopupVisible}
        message={popUpmsg}
        onClose={onClosePopup}
      />
      <Button onPress={onButtonPress} />
      <View style={styles.imageContainer}>
        {alertState && (leftValue != 0 || rightValue != 0) && (
          <Image
            source={require("../assets/belltransparent.gif")}
            style={styles.gif}
          />
        )}
        {!alertState && (leftValue != 0 || rightValue != 0) && (
          <Image source={require("../assets/lounge.gif")} style={styles.gif} />
        )}
        {!alertState && leftValue === 0 && rightValue === 0 && (
          <Image source={require("../assets/coffee.gif")} style={styles.gif} />
        )}
        {alertState && leftValue === 0 && rightValue === 0 && (
          <Image source={require("../assets/coffee.gif")} style={styles.gif} />
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
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0,
  },
  gif: {
    width: "100%",
    height: "100%",
  },
});

export default HomePage;
