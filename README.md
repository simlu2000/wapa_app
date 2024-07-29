WAPA App

Descrizione del Progetto
WAPA App è una web app meteorologica progettata per raccogliere e visualizzare dati climatici basilari e avanzati da varie fonti tramite l'uso di API. Il progetto è parte della mia tesi universitaria ed è ancora in fase di sviluppo.

Funzionalità
Visualizzazione dati climatici basilari:
Temperatura percepita
Temperatura minima e massima
Umidità
Pressione
Punto di rugiada
Ora di alba e tramonto
Percentuale di nuvolosità
Visualizzazione forecast (previsioni a 5 giorni)
Determinazione località:
Tramite barra di ricerca
Tramite localizzazione utente
Selezione località preferita dall'utente
Visualizzazione dati avanzati (da realizzare con API NASA)
Gestione utenza:
Registrazione
Accesso tramite email/password o account Google
API Utilizzate
OpenWeatherAPI: fornisce i dati meteo
Unsplash API: imposta lo sfondo della schermata home in base a un'immagine generata casualmente dalla categoria 'sky'
NASA API:
EPIC: immagini quotidiane della Terra
APOD: immagine astronomica quotidiana
DONKI: informazioni e analisi su dati avanzati come il chiarore solare degli ultimi 30 giorni
Gestione del Database Utenti
Firebase Realtime DB: utilizzato per la gestione del database utenti
Firebase Authentication: implementato per l'autenticazione degli utenti
Organizzazione delle Schermate
HomeScreen: introduzione alla app con elenco delle funzionalità offerte
WeatherScreen: visualizzazione dati climatici in forma testuale e grafica (alba e tramonto visualizzati con un chart generato con D3.JS; velocità del vento, temperatura e pressione mediante charts generati da ECharts) e mappe interattive
UserProfileScreen: pagina riservata all'utente con possibilità di aggiunta/rimozione località
SignUpScreen: pagina di registrazione/accesso
AdvancedScreen (da realizzare)
PrivacyPolicyScreen
Componenti
EarthImage: generazione immagine quotidiana della Terra mediante NASA EPIC API
UnsplashFetching: sfondo schermata home
PressureChart, TempChart e WindCharts
Sunrise, Sunset
PrecipitationMap, TemperatureMap, WeatherMap, WindMap
Footer (da inserire)
NavBar
PercentageBox: barra progressiva per le percentuali
SearchLocation
UserPlaces: preferenze utente
Stato del Progetto
Il progetto non è ancora completo. Mancano le seguenti parti:

Realizzazione della pagina di dati avanzati (AdvancedScreen)
Sistemazione e completamento del lato responsive
Installazione
Clona la repository: git clone https://github.com/simlu2000/wapa_app.git
Entra nella directory del progetto: cd wapa_app
Installa le dipendenze: npm install
Avvia l'applicazione: npm start
