import React, { useState,useRef } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import {updateProfile } from 'firebase/auth';
import { Link, useNavigate } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";
import NavbarComponent from "../drive/NavbarComponent";
import styles from "./css/Profile.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import malepicUrl from './images/man_avatar.png'
import femalepicUrl from './images/women_avatar.png'
import { toast } from "react-hot-toast";

export default function Profile() {
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const [name,setName]=useState(currentUser.displayName)
  const [gender, setGender] = React.useState('M');
  const history = useNavigate();

  let profilePhotoUrl=gender==='M'?malepicUrl :femalepicUrl;
  const updateUserName = async (newName) => {
    try {
      await updateProfile(currentUser, { displayName: newName });
      toast.success(
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            transition: 'slide-in-right',
          }}
        >
          <span style={{ marginRight: '0.9em' }}>User name updated successfully <span role="img" aria-label="Success">✔️</span></span>
        </div>,
        {
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
      console.log('User name updated successfully.');
    } catch (error) {
      toast.error(
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            transition: 'slide-in-right',
          }}
        >
          <span style={{ marginRight: '0.9em' }}>Error updating user name <span role="img" aria-label="Failed">😔</span></span>
        </div>,
        {
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
      console.error('Error updating user name:', error);
    }
    setName(currentUser.displayName);
  };

  function handleNameChange(event){
  setName(event.target.value);
  }
  const handleEditClick = () => {
    inputRef.current.focus();
  };
  const handleToggle = () => {
    setGender(gender === 'M' ? 'F' : 'M');
  };
  
  async function handleLogout() {
    setError("");
    try {
      await logout();
      toast.success(
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            transition: 'slide-in-right',
          }}
        >
          <span style={{ marginRight: '0.9em' }}>You are logged out <span role="img" aria-label="Bye">👋</span></span>
        </div>,
        {
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
      history("/login");
    } catch {
      toast.error(
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            transition: 'slide-in-right',
          }}
        >
          <span style={{ marginRight: '0.9em' }}>Failed to logout <span role="img" aria-label="Failed">⚠️</span></span>
        </div>,
        {
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
      setError("Failed to log out");
    }
  }

  return (<>
    <NavbarComponent logout={handleLogout}/>
    <CenteredContainer>
      <Card
        style = {{
        padding: "2rem",
        marginTop: "1rem",
        borderRadius: "1rem",
        backgroundColor: "#ffffffc2",
        boxShadow: "1px 1px 1rem black"
        }}
      >
        <Card.Body>
          <div className={styles.profile}>
            <img className={styles.profileImg}  src={profilePhotoUrl} alt="Profile-Img" />
           <div className={styles.inputArea}>
            <input className={styles.nameInput} ref={inputRef}
                value={name} placeholder="Click to Change Name" onChange={handleNameChange}/>
                <div className={styles.icons}><FontAwesomeIcon onClick={handleEditClick}  icon={faPencilAlt} className={styles.glowingEditIcon}  />
                 <FontAwesomeIcon onClick={()=>{updateUserName(name)}} icon={faCheck} className={styles.glowingTickIcon} />
                </div>
            </div> 
            <p>{currentUser.email}</p>
            <div className={styles.genderToggle}>
            <div className={`${styles.toggleButton} ${styles[gender]}`} onClick={handleToggle}>
                <div className={styles.slider}></div>
              </div>
              <span>{gender}</span>
            </div>

          </div> 
                      
        </Card.Body>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
        <div className="w-100 text-center mt-2">
          <Button variant="dark" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Card>
    </CenteredContainer>
    </>
  );
}
