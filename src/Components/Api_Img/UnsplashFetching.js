import React, { useEffect } from 'react';
import axios from 'axios';
//import {Api_Key_Unsplash} from "../../Utils/API_KEYS";
const Api_Key_Unsplash=process.env.REACT_APP_Api_Key_Unsplash;
const UnsplashFetching = ({ setBackgroundImage }) => {
  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${Api_Key_Unsplash}`
          },
          params: {
            query: 'sky',
            orientation: 'landscape'
          }
        });
        console.log('Immagine recuperata:', response.data.urls.regular); // Aggiunto log
        setBackgroundImage(response.data.urls.regular);
      } catch (error) {
        console.error('Errore nel recupero dell\'immagine:', error);
      }
    }

    fetchImage();
  }, [setBackgroundImage]);

  return null; // Questo componente non rende nulla
};

export default UnsplashFetching;
