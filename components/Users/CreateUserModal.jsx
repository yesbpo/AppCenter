import React, {useState} from 'react';
import DropdownMenu from "../DropdownMenu";
import {UIButton} from "../PageButton";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, firestore} from "../../utils/firebase";
import {deleteDoc, doc, setDoc} from "firebase/firestore";

const bloodTypes = [
  { type: "A+" },
  { type: "A-"},
  { type: "B+" },
  { type: "B-" },
  { type: "AB+" },
  { type: "AB-" },
  { type: "O+" },
  { type: "O-" },
]

const roles = [
  { type: "Asesor" },
  { type: "Coordinador"},
  { type: "Administrador" },
]

const emptyUser = {
  bloodType: "A+",
  role: "Asesor",
  name: "",
  userName: "",
  phone: "",
  email: ""
}

const CreateUserModal = ({ closeModal, editUser }) => {

  // User data.
  const selectedUser = editUser ?? emptyUser
  const [selectedBloodTypes, setSelectedBloodTypes] = useState({type: selectedUser.bloodType})
  const [selectedRoles, setSelectedRoles] = useState({type: selectedUser.role})
  const [name, setName] = useState(selectedUser.name);
  const [userName, setUserName] = useState(selectedUser.userName);
  const [password, setPassword] = useState( "");
  const [phone, setPhone] = useState(selectedUser.phone);
  const [email, setEmail] = useState(selectedUser.email);

  // Error handling.
  const [nameError, setNameError] = useState(true);
  const [userNameError, setUserNameError] = useState(true);
  const [userNameErrorText, setUserNameErrorText] = useState("* El user name debe tener al menos 2 caracteres.");
  const [phoneError, setPhoneError] = useState(true);
  const [emailError, setEmailError] = useState(true);
  const [passwordError, setPasswordError] = useState(true);

  // Done button handling.
  const handleDone = async () => {
    console.log("Handle Done tapped");
    // Text fields verifications.
    const nameVerification = name && name.length >= 2;
    const userNameVerification = userName && userName.length >= 2;
    const phoneVerification = phone && phone.length === 10 && /^\d{10}$/.test(phone);
    const emailVerification = email && email.length > 7 && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    const passwordVerification = password && password.length > 7;

    // Set values for errors.
    setNameError(nameVerification);
    setUserNameError(userNameVerification);
    setUserNameErrorText("* El user name debe tener al menos 2 caracteres.")
    setPhoneError(phoneVerification);
    setEmailError(emailVerification);
    setPasswordError(passwordVerification);

    // If verification pass, create user authentication and struct.
    if (nameVerification && userNameVerification && phoneVerification && emailVerification) {
      let passed = false
      try {
        const userRef = doc(firestore, "users", userName);
        await setDoc(userRef, {
          name: name,
          userName: userName,
          phone: phone,
          email: email,
          bloodType: selectedBloodTypes.type,
          role: selectedRoles.type
        }, {merge: true});
        passed = true

      } catch ({messageSaving}) {
        console.log("Couldn't save user: " + messageSaving);
        passed = false
      }

      try {
        // Only create user auth creds if we're not editing and if we saved the data.
        if (passed && editUser == null && passwordVerification) {
          await createUserWithEmailAndPassword(
              auth,
              userName+"@yesbpo.com",
              password
          );
        }
        close();
      } catch (e) {
        setUserNameError(!userNameVerification);
        setUserNameErrorText("* El nombre de usuario ya ha sido usado.")
        console.log("Couldn't signup/create: " + e);
      }
    }
  }

  const handleDeleteUser = async () => {
    try {
      await deleteDoc(doc(firestore, "users", userName));
      close();
    } catch ({messageDeleting}) {
      console.log("Couldn't delete user: " + messageDeleting);
    }
  }

  // Cancel button handling.
  const close = () => {
    // Reset all values.
    setName("");
    setUserName("");
    setPassword("");
    setPhone(null);
    setEmail(null);
    setSelectedBloodTypes(bloodTypes[0]);
    setSelectedRoles(roles[0]);

    //Reset all errors.
    setNameError(true);
    setUserNameError(true);
    setUserNameErrorText("* El user name debe tener al menos 2 caracteres.")
    setPhoneError(true);
    setEmailError(true);
    setPasswordError(true);

    // Close modal and navigate back.
    closeModal();
  }

  return (
      <div className="flex flex-col justify-center p-12 bg-light-lighter shadow-2xl rounded-2xl">
        <div className="flex justify-between p-4">
          <div className="flex flex-col">
            <input
                type="text"
                className="bg-[#e2e3e5] shadow-md w-96 h-16 rounded-md p-4 mr-4"
                placeholder="Nombre"
                value={name}
                disabled={editUser == null ? false : true}
                onChange={(e) => { setName(e.target.value) }}
            />
            { !nameError && <p className="text-red text-bold">* El nombre debe tener al menos 2 caracteres.</p> }
          </div>
          <div className="flex flex-col">
            <input
                type="text"
                className="bg-[#e2e3e5] shadow-md w-96 h-16 rounded-md p-4"
                placeholder="Nombre de usuario"
                value={userName}
                disabled={editUser == null ? false : true}
                onChange={(e) => { setUserName(e.target.value) }}
            />
            { !userNameError && <p className="text-red text-bold">{userNameErrorText}</p> }
          </div>
        </div>
        <div className="flex justify-between p-4">
          <div className="flex flex-col">
            <input
                type="tel"
                className="bg-[#e2e3e5] shadow-md w-96 h-16 rounded-md p-4 mr-4"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => { setPhone(e.target.value) }}
            />
            { !phoneError && <p className="text-red text-bold">* El teléfono debe contener 10 dígitos.</p> }
          </div>
          <div className="flex flex-col">
            <input
                type="email"
                className="bg-[#e2e3e5] shadow-md w-96 h-16 rounded-md p-4"
                placeholder="Correo"
                value={email}
                disabled={editUser == null ? false : true}
                onChange={(e) => { setEmail(e.target.value) }}
            />
            { !emailError && <p className="text-red text-bold">* Formato de correo incorrecto.</p> }
          </div>
        </div>
        {
          editUser == null &&
            <div className="flex justify-center p-4">
              <div className="flex flex-col">
                <input
                    type="password"
                    className="bg-[#e2e3e5] shadow-md w-96 h-16 rounded-md p-4"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                { !passwordError && <p className="text-red text-bold">* La contraseña debe tener al menos 8 caracteres.</p> }
              </div>
            </div>
        }
        <div className="flex justify-between p-4 z-10">
          <DropdownMenu elements={bloodTypes} selected={selectedBloodTypes} setSelected={setSelectedBloodTypes}/>
          <DropdownMenu elements={roles} selected={selectedRoles} setSelected={setSelectedRoles}/>
        </div>

        <div className="flex justify-between p-8 z-0">
          <UIButton onClick={() => {close()}}
                    className="bg-red w-40 h-14 text-light-lighter inline-flex items-center">
            CANCELAR
          </UIButton>
          {
            editUser !== null &&
                <UIButton onClick={() => {handleDeleteUser()}}
                          className="bg-[#ba574a] w-40 h-14 text-light-lighter inline-flex items-center">
                  ELIMINAR
                </UIButton>
          }

          <UIButton onClick={() => {handleDone()}}
                    className="bg-green w-40 h-14 text-light-lighter inline-flex items-center">
            {
              editUser === null ? "CREAR" : "GUARDAR"
            }
          </UIButton>
        </div>
      </div>
  );
};

export default CreateUserModal;
