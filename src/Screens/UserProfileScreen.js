import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import "../Styles/style_userprofilescreen.css";
import UserPlaces from '../Components/UserPlaces';
import { addLocation, removeLocation, getUserLocalities } from '../Utils/userService';
import { auth } from '../Utils/firebase';

const UserProfileScreen = ({ user }) => {
  const [userLocalities, setUserLocalities] = useState([]);
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); //gestione state toggle notifiche 

  useEffect(() => {
    const fetchUserLocalities = async () => {
      if (user) {
        try {
          const localities = await getUserLocalities(user.uid);
          setUserLocalities(localities);
        } catch (error) {
          console.error("Error fetching user localities:", error);
        }
      }
    };

    fetchUserLocalities();
  }, [user]);

  useEffect(() => {
    //recupera stato notifiche dal db o local storage
    const savedPreference = localStorage.getItem('notificationsEnabled');
    if (savedPreference !== null) {
      setNotificationsEnabled(JSON.parse(savedPreference));
    }
  }, []);

  const handleToggleChange = async (event) => { //stato toggle
    const enabled = event.target.checked;
    setNotificationsEnabled(enabled);
    //salva preferenza 
    localStorage.setItem('notificationsEnabled', JSON.stringify(enabled));

    if (enabled) {
      try {
        await askPermission();
        window.alert('Notifications turned on');
      } catch (error) {
        console.error('Error during the request of permissions', error);
      }
    } else {
      console.log('Notifications turned off');
    }
  };

  async function askPermission() {
    const permissionResult_1 = await new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    });
    if (permissionResult_1 !== 'granted') {
      throw new Error('Non sono stati concessi i permessi per le notifiche.');
    }
  }



  const handleAddLocation = async (location) => {
    if (user) {
      try {
        await addLocation(user.uid, location);
        const localities = await getUserLocalities(user.uid);
        setUserLocalities(localities);
      } catch (error) {
        console.error("Error adding location:", error);
      }
    }
  };

  const handleRemoveLocation = async (location) => {
    if (user) {
      try {
        await removeLocation(user.uid, location);
        const localities = await getUserLocalities(user.uid);
        setUserLocalities(localities);
      } catch (error) {
        console.error("Error removing location:", error);
      }
    }
  };

  const handleSelectLocation = (location) => {
    console.log(`Selected location: ${location}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile</p>;
  }

  return (
    <>
      <section id="users-data" className="container-data">
        <h1>Your Profile</h1>
        <div id="user-area">
          <label htmlFor="user-email">E-mail:</label>
          <input id="user-email" className="user-info" type="email" value={user.email}  readOnly/>
          <label htmlFor="user-name" id="label2">Name:</label>
          <input id="user-name" className="user-info" type="text" value={user.displayName || "N/A"} readOnly/>
          <label id="label3">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleChange}
            />
            Notifications
          </label>
        </div>
        <div id="loc-area">
          <UserPlaces
            userId={user.uid}
            onAddLocation={handleAddLocation}
            onRemoveLocation={handleRemoveLocation}
            onSelectLocation={handleSelectLocation}
            getUserLocalities={getUserLocalities}
          />
        </div>


        <button onClick={handleLogout} id="logout-button">Log out</button>
      </section>
    </>
  );
};

export default UserProfileScreen;
