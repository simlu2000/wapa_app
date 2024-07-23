import { useEffect, useState } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { auth, realtimeDb } from '../Utils/firebase'; // Importa con il nome corretto
import { onAuthStateChanged } from 'firebase/auth';

const UserPlaces = () => {
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userRef = ref(realtimeDb, 'users/' + user.uid + '/locations');
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setLocations(data ? Object.values(data) : []);
        });
      } else {
        setUser(null);
        setLocations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addLocation = () => {
    if (!newLocation.trim()) return;

    const userRef = ref(realtimeDb, 'users/' + user.uid + '/locations');
    const newLocationRef = ref(userRef, newLocation);
    set(newLocationRef, newLocation).then(() => {
      setLocations((prev) => [...prev, newLocation]);
      setNewLocation('');
    });
  };

  const removeLocation = (location) => {
    const userRef = ref(realtimeDb, 'users/' + user.uid + '/locations/' + location);
    set(userRef, null).then(() => {
      setLocations((prev) => prev.filter((loc) => loc !== location));
    });
  };

  if (!user) return null;

  return (
    <div>
      <input
        type="text"
        value={newLocation}
        onChange={(e) => setNewLocation(e.target.value)}
        placeholder="Add new location"
      />
      <button onClick={addLocation}>Add Location</button>
      <ul>
        {locations.map((location, index) => (
          <li key={index}>
            {location}
            <button onClick={() => removeLocation(location)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPlaces;
