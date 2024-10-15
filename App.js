import { View, TextInput, Button, ScrollView, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import React, { useState, useRef } from 'react';
import QRCodeSVG from 'react-native-qrcode-svg'; // Biblioteca de QR code
import * as Print from 'expo-print';

export default function App() {
  const [startNumber, setStartNumber] = useState('');
  const [endNumber, setEndNumber] = useState('');
  const [qrCodes, setQrCodes] = useState([]);
  const qrCodeRefs = useRef({}); // Para armazenar as referências dos QR codes gerados

  const generateHTML = async () => {
    let htmlContent = `
      <html>
      <head>
        <style>
          .qrCodeContainer { display: flex; flex-wrap: wrap; justify-content: center; }
          .qrCode { margin: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="qrCodeContainer">
    `;

    // Converta cada QR code em base64
    for (let number of qrCodes) {
      const qrRef = qrCodeRefs.current[number];
      const qrCodeDataURL = await new Promise((resolve) => {
        qrRef.toDataURL((dataURL) => {
          resolve(dataURL); // Gerar o QR code como base64
        });
      });

      // Adicione 'data:image/png;base64,' antes do conteúdo base64
      htmlContent += `
        <div class="qrCode">
          <p>Ficha ${number}:</p>
          <img src="data:image/png;base64,${qrCodeDataURL}" alt="QR Code"/>
        </div>
      `;
    }

    htmlContent += `
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  const printPDF = async () => {
    const htmlContent = await generateHTML(); // Certifique-se de que o HTML seja gerado com QR Codes base64
    await Print.printAsync({
      html: htmlContent
    });
  };

  const generateQRCodes = () => {
    const start = parseInt(startNumber);
    const end = parseInt(endNumber);

    if (isNaN(start) || isNaN(end) || start > end) {
      alert("Informe um intervalo de números válido.");
      return;
    }

    const codes = [];
    for (let i = start; i <= end; i++) {
      codes.push(i);
    }
    setQrCodes(codes);
  };

  return (
    <ImageBackground
      source={require("./assets/fundo.png")}
      style={{ flex: 1,height:900 }}
    >
      <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
        <View style={{ width: '100%', height: 250, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
          <Image 
            source={require("./assets/logo.png")}
            style={{ width: 300, height: 300 }}
          />
        </View>
        <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: 'white' }}>
            GERADOR QRCODE INFOREST
          </Text>
        </View>
        <Text style={styles.label}>Digite o primeiro número:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={startNumber}
          onChangeText={setStartNumber}
        />
        <Text style={styles.label}>Digite o último número:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={endNumber}
          onChangeText={setEndNumber}
        />
        <Button title="Gerar QR Codes" onPress={generateQRCodes} />
        <View style={{ marginVertical: 10 }}>
          <Button title="Exportar para PDF" onPress={printPDF} />
        </View>
        <ScrollView contentContainerStyle={styles.container} horizontal={true}>
          <View style={styles.qrCodeContainer}>
            {qrCodes.map((number) => (
              <View key={number} style={styles.qrCode}>
                <Text style={{ color: 'white' }}>Ficha {number}:</Text>
                {/* Armazena a referência de cada QR code */}
                <QRCodeSVG 
                  value={number.toString()} 
                  size={160} 
                  getRef={(c) => (qrCodeRefs.current[number] = c)} // Captura a referência para usar no base64
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '80%',
    paddingHorizontal: 8,
    color: 'white',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection:'row',
  },
  qrCode: {
    marginBottom: 20,
    alignItems: 'center',
    marginHorizontal:10
  },
});
