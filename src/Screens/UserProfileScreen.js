import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLocalities, addLocation, removeLocation } from '../Utils/userService';
import UserPlaces from '../Components/UserPlaces';
import { signOut, auth } from '../Utils/firebase';
import '../Styles/style_userprofilescreen.css';
import animationData from '../Animations/Animation - 1721298712078.json';
import Lottie from 'react-lottie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const UserProfileScreen = ({ user }) => {
  const [userLocalities, setUserLocalities] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    const fetchUserLocalities = async () => {
      if (user) {
        try {
          const localities = await getUserLocalities(user.uid);
          setUserLocalities(localities);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user localities:", error);
          setLoading(false);

        }
      }
    };

    fetchUserLocalities();
  }, [user]);

  useEffect(() => {
    const savedPreference = localStorage.getItem('notificationsEnabled');
    if (savedPreference !== null) {
      setNotificationsEnabled(JSON.parse(savedPreference));
    }
  }, []);

  const handleToggleChange = async (event) => {
    const enabled = event.target.checked;
    setNotificationsEnabled(enabled);
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
    const permissionResult = await new Promise((resolve, reject) => {
      const permission = Notification.requestPermission();
      resolve(permission);
    });
    if (permissionResult !== 'granted') {
      throw new Error('No granted permissions');
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
      {loading ? (
        <div className="animation-container">
          <Lottie
            options={defaultOptions}
            height={"150px"}
            width={"150px"}
          />        </div>
      ) : (<>
        <section id="users-data" className="container-data">
          <h1>Your Profile</h1>
          <div id="user-area">
            <label htmlFor="user-email">E-mail:</label>
            <input id="user-email" className="user-info" type="email" value={user.email} readOnly />
            <label htmlFor="user-name" id="label2">Name:</label>
            <input id="user-name" className="user-info" type="text" value={user.displayName || "N/A"} readOnly />
            {/*<label id="label3">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleToggleChange}
              />
              Notifications
            </label>*/}
          </div>
          <button onClick={handleLogout} id="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#F7F7F7" }} />
          </button>
        </section>
      </>)}
    </>
  );
};

export default UserProfileScreen;