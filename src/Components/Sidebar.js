import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Info, Cloud, Rocket, Person, AddCircle, Search, Star, Menu, Close } from '@mui/icons-material';
import UserPlaces from './UserPlaces';
import { addLocation, removeLocation, getUserLocalities } from '../Utils/userService';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

const SideBar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localities, setLocalities] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [newLocation, setNewLocation] = useState('');

  const handleAddLocation = async (location) => {
    if (user) {
      try {
        await addLocation(user.uid, location);
        const updatedLocalities = await getUserLocalities(user.uid);
        setLocalities(updatedLocalities);
      } catch (error) {
        console.error("Error adding location:", error);
      }
    }
  };

  const handleRemoveLocation = async (location) => {
    if (user) {
      try {
        await removeLocation(user.uid, location);
        const updatedLocalities = await getUserLocalities(user.uid);
        setLocalities(updatedLocalities);
      } catch (error) {
        console.error("Error removing location:", error);
      }
    }
  };

  const handleSelectLocation = (location) => {
    navigate('/WeatherScreen', { state: { query: location } });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const fetchLocalities = async () => {
      if (user) {
        try {
          const localitiesList = await getUserLocalities(user.uid);
          setLocalities(localitiesList);
        } catch (error) {
          console.error("Error fetching localities:", error);
        }
      }
    };

    fetchLocalities();
  }, [user]);

  return (
    <>
      <AppBar position="static" sx={{ display: { xs: 'none', sm: 'flex' }, backdropFilter: 'blur(16px) saturate(181%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
        <Toolbar>
          <IconButton edge="start" color="#000000" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu />
          </IconButton>
          <h6>WAPA</h6>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <List>
          <ListItem button component={Link} to="/" onClick={() => setIsMenuOpen(false)}>
            <ListItemIcon><Home sx={{ color: 'black' }} /></ListItemIcon>
            <ListItemText sx={{ color: 'black' }} primary="Home" />
          </ListItem>
          {/*<ListItem button component={Link} to="/AboutScreen" onClick={() => setIsMenuOpen(false)}>
            <ListItemIcon><Info sx={{ color: 'black' }} /></ListItemIcon>
            <ListItemText sx={{ color: 'black' }} primary="About" />
          </ListItem>
          */}
          <ListItem button component={Link} to="/WeatherScreen" onClick={() => setIsMenuOpen(false)}>
            <ListItemIcon><Cloud sx={{ color: 'black' }} /></ListItemIcon>
            <ListItemText sx={{ color: 'black' }} primary="Weather" />
          </ListItem>
          <ListItem button component={Link} to="/AdvancedScreen" onClick={() => setIsMenuOpen(false)}>
            <ListItemIcon><Rocket sx={{ color: 'black' }} /></ListItemIcon>
            <ListItemText sx={{ color: 'black' }} primary="Advanced" />
          </ListItem>
          {user ? (
            <ListItem button component={Link} to="/UserProfileScreen" onClick={() => setIsMenuOpen(false)}>
              <ListItemIcon><Person sx={{ color: 'black' }} /></ListItemIcon>
              <ListItemText sx={{ color: 'black' }} primary="Profile" />
            </ListItem>
          ) : (
            <ListItem button component={Link} to="/SignUpScreen" onClick={() => setIsMenuOpen(false)}>
              <ListItemIcon><AddCircle sx={{ color: 'black' }} /></ListItemIcon>
              <ListItemText sx={{ color: 'black' }} primary="Sign Up" />
            </ListItem>
          )}
          {user && (
            <ListItem  button component={Link} onClick={() => setIsDialogOpen(true)}>
              <ListItemIcon><Search sx={{ color: 'black' }} /></ListItemIcon>
              <ListItemText sx={{ color: 'black' }} primary="Localities" />
            </ListItem>
          )}
        </List>
      </Drawer>

      <BottomNavigation
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          display: { xs: 'flex', sm: 'none' },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1300,
        }}
      >
        <BottomNavigationAction icon={<Home fontSize="small" />} component={Link} to="/" />
        {/*<BottomNavigationAction label="About" icon={<Info />} component={Link} to="/AboutScreen" />*/}
        <BottomNavigationAction
          icon={<Search fontSize="small" />}
          onClick={() => setIsDialogOpen(true)}
        />
        <BottomNavigationAction icon={<Cloud fontSize="small" />} component={Link} to="/WeatherScreen" />
        <BottomNavigationAction icon={<Rocket fontSize="small" />} component={Link} to="/AdvancedScreen" />
        {user && (
          <BottomNavigationAction
            icon={<Person fontSize="small" />}
            component={Link}
            to="/UserProfileScreen"
          />
        )}
      </BottomNavigation>


      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
        <DialogTitle>Localities control</DialogTitle>
        <DialogContent>
          <TextField
            label="New Location"
            fullWidth
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />

          {localities.length > 0 ? (
            localities.map((loc, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => {
                  handleSelectLocation(loc);
                  setIsDialogOpen(false);
                }}>
                  {loc}
                </span>
                <Button color="error" size="small" onClick={() => handleRemoveLocation(loc)}>
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No localities.</p>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          <Button
            onClick={async () => {
              if (newLocation.trim()) {
                await handleAddLocation(newLocation);
                setNewLocation('');
              }
            }}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default SideBar;
