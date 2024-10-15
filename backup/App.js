import { View, TextInput, Button, ScrollView, Text, StyleSheet,Image,ImageBackground } from 'react-native';
import react, {useEffect,useState,useCallback} from "react";
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
//import QRCode from 'qrcode';

export default function App() {
  const [startNumber, setStartNumber] = useState('');
  const [endNumber, setEndNumber] = useState('');
  const [qrCodes, setQrCodes] = useState([]);


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

    // Converta cada número em uma imagem de QR Code base64
    for (let number of qrCodes) {
      const qrCodeDataURL = await QRCode.toDataURL(number.toString());
      htmlContent += `
        <div class="qrCode">
          <p>Ficha ${number}:</p>
          <img src="${qrCodeDataURL}" alt="QR Code"/>
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
    const htmlContent = generateHTML();
    await Print.printAsync({
      html: htmlContent
    });
  };


  const generateQRCodes = () => {
    const start = parseInt(startNumber);
    const end = parseInt(endNumber);
    
    if (isNaN(start) || isNaN(end) || start > end) {
      alert("Informa o intervalo de numeros");
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
      style={{flex:1}}
    >
      <ScrollView contentContainerStyle={styles.container}>
          <View style={{width:'100%',height:250,alignItems:'center',justifyContent:'center',marginTop:50}}>
            <Image 
              source={require("./assets/logo.png")}
              style={{width:300,height:300}}
            />
          </View>
        <View style={{width:'100%',height:50,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:20,color:'white'}}>
            GERADOR QRCODE INFOREST
          </Text>
        </View>
        <Text style={styles.label}>Digite primeiro número:</Text>
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
        <View style={{marginVertical:10}}>
          <Button title="Exportar para PDF" onPress={printPDF}/>
        </View>

        
        <View style={styles.qrCodeContainer}>
          {qrCodes.map((number) => (
            <View key={number} style={styles.qrCode}>
              <Text style={{color:'white'}}>Ficha {number}:</Text>
              <QRCode value={number.toString()} size={200} />
            </View>
          ))}
        </View>
      </ScrollView>
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
    color:'white'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '80%',
    paddingHorizontal: 8,
    color:'white'
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrCode: {
    marginBottom: 20,
    alignItems: 'center',
  },
});
