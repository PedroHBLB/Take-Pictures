import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, Image, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraType } from 'expo-camera/build';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import api from './api/api';

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions(); // Permissões de Câmera do expo
  const [captured, requestCaptured] = useState(null);
  const [open, requestOpen] = useState(false);
  const [storage, requestStorage] = useState(null);
  const [save, requestSave] = useState(null);


  if (!permission) {
    return <View></View>
  }

  if (!permission.granted) { //Pege permissão para usar a câmera
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Precisamos da sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync(); // Pega os dados da imagem
      requestCaptured(data.uri);
      requestOpen(true);
      console.log(data);

    }

  }
  async function storagePicture() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      requestStorage(result.uri);
      //requestCaptured(result.uri);
      requestOpen(true);
      //this.uploadImage(result.uri)

      const formData = new FormData();
      formData.append('image', {
        uri: result.uri,
        name: Date.now(),
      });
      console.log(formData);
      // O problema ta no try

        await axios.post('http://localhost:4500/uploadFile', formData, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })
        .then( function (response){
          console.log(response);
        })
        .catch( function (error){
          console.log(error);
        })

    }
  }


  // const uploadImage = async (result) => {
  //   const formData = new FormData();
  //   formData.append('image', {
  //     uri: result.uri,
  //     name: Date.now(),
  //     type: 'image/jpg'
  //   });
  //   try {
  //     await axios.post('http://localhost:4500/uploadFile/', formData, {
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })
  //   } catch (error) {
  //     console.log("Não passei")
  //     console.log(error);
  //   }

  // }

  return (
    //SafeAreaView é a área da câmera
    <SafeAreaView style={styles.container}>
      <Camera
        style={{ flex: 1 }}//Estilo da camera
        type={type} // Tipo frontal o camera de tras
        ref={camRef} // Pega os dados da foto tirada
      >
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity style={{ // Botão de troca de visão (Câmera frontal e traseira)
            position: 'absolute',
            bottom: 20,
            left: 20
          }}
            onPress={() => { // Ação de pressionar o botão realiza as seguintes funções:
              setType(
                type === CameraType.back // Inicia com a câmera traseira
                  ? CameraType.front //Caso mude vai para a câmera frontal
                  : CameraType.back // Se não mude para a câmera traseira
              );
            }}
          >
            <Text style={{ marginBottom: 13, color: 'red' }}>Trocar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            position: 'absolute',
            bottom: 20,
            right: 20
          }}
            onPress={storagePicture}>
            <Text style={{ marginBottom: 13, color: 'red' }}>Galeria</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity type="file" style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={23} color="#FFF" />
      </TouchableOpacity>

      {requestCaptured && // Se a captura da foto existir ele mostra o modal
        <Modal
          animationType='slide'
          transparent={false}
          visible={open} // Visibilidade open que pode ser tanto True como False
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => requestOpen(false)}/* Ação de pressionar para fechar a visibilidade */>
              <FontAwesome name="close" size={23} color="red" />
            </TouchableOpacity>


            <Image style={{ width: '100%', height: 300, borderRadius: 20 }} source={{ uri: captured }} /* uri: captured pega a imagem e mostra ela na tela */>
            </Image>

          </View>

        </Modal>
      }
      {requestStorage &&
        <Modal
          animationType='slide'
          transparent={false}
          visible={open}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => requestOpen(false)}/* Ação de pressionar para fechar a visibilidade */>
              <FontAwesome name="close" size={23} color="red" />
            </TouchableOpacity>

            <Image style={{ width: '100%', height: 300, borderRadius: 20 }} source={{ uri: storage }} /* uri: captured pega a imagem e mostra ela na tela */>
            </Image>

            {/* <TouchableOpacity style={{
              position: 'absolute',
              bottom: 20,
              right: 150,
            }}
              onPress={uploadImage}>
              <Text style={{ marginBottom: 13, color: 'red' }}>Upload</Text>
            </TouchableOpacity> */}


          </View>
        </Modal>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    margin: 20,
    borderRadius: 10,
    height: 50
  }
});
