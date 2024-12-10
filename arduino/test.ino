#include <WiFi.h>
#include <HTTPClient.h>
#include "PubSubClient.h"
#include <ArduinoJson.h>


WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* mqttServer = "broker.hivemq.com";
const char* mqttTopic = "lele-dumbo-testing";
int mqttPort = 1883;

#define ECHO_PIN 26
#define TRIG_PIN 27

float distance_cm, duration_us;

const char* binID = "0001";
String macAddress = ""; // Wi-Fi MAC address
String ipAddress = "";  // Device IP address

String extractLocationData(String response) {
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (error) {
        Serial.print("JSON Parsing Error: ");
        Serial.println(error.c_str());
        return "{}"; // Return empty JSON on error
    }

    // Extract required fields
    String loc = doc["loc"] | "";
    String region = doc["region"] | "";
    String country = doc["country"] | "";

    // Create new JSON object
    StaticJsonDocument<128> resultDoc;
    resultDoc["loc"] = loc;
    resultDoc["region"] = region;
    resultDoc["country"] = country;

    String result;
    serializeJson(resultDoc, result);
    return result;
}

void reconnect() {
    Serial.println("Connecting to MQTT Broker...");
    while (!mqttClient.connected()) {
        Serial.println("Reconnecting to MQTT Broker...");
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);

        if (mqttClient.connect(clientId.c_str())) {
            Serial.println("Connected.");
        }
    }
}


void setupMQTT() {
    mqttClient.setServer(mqttServer, mqttPort);
}

void updateWiFiInfo() {
    macAddress = WiFi.macAddress(); // Get MAC address
    ipAddress = WiFi.localIP().toString(); // Get IP address
}

String getGeolocationFromIPAPI() {
    HTTPClient http;
    http.begin("https://ipinfo.io/json"); // Get geolocation based on public IP
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
        String response = http.getString();
        http.end();
        return response; // Return the full response
    } else {
        Serial.println("Error on HTTP request");
    }
    http.end();
    return "";
}

void setup() {
    Serial.begin(115200);
    Serial.println("Hello, ESP32!");
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("Connected to Wi-Fi");

    updateWiFiInfo();   // Retrieve MAC and IP address
    setupMQTT();
}

void loop() {
    if (!mqttClient.connected())
        reconnect();

    mqttClient.loop();

    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    duration_us = pulseIn(ECHO_PIN, HIGH);
    distance_cm = 0.017 * duration_us;

    // Update location and Wi-Fi info periodically
    static unsigned long lastUpdate = 0;
    if (millis() - lastUpdate > 5000) { // Update every 5 seconds
        String response = getGeolocationFromIPAPI();  // Get full response from IP API
        updateWiFiInfo();           // Update Wi-Fi info
        lastUpdate = millis();

        String locationData = extractLocationData(response); // Extract specific fields
        char message[256];
        snprintf(message, sizeof(message),
                "{\"binID\":\"%s\", \"dis\":%.2f, \"location\":%s}",
                binID, distance_cm, locationData.c_str());
      
        Serial.print("Publishing: ");
        Serial.println(message);
        bool published = mqttClient.publish(mqttTopic, message);
        if (!published) {
            Serial.println("Failed to publish message. Check MQTT client status:");
            Serial.printf("Client connected: %d\n", mqttClient.connected());
            Serial.printf("Message length: %d bytes\n", strlen(message));
        }
    }

    delay(2000);
}