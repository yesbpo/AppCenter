import React, {useEffect, useRef, useState} from 'react';
import {BadgeCheckIcon} from "@heroicons/react/outline";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../utils/firebase";
import classNames from "classnames";
import ReCAPTCHA from "react-google-recaptcha";
import {useRouter} from "next/router";
import {selectAuthState, setAuthState} from "../store/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {setUid, setUserName} from "../store/userSlice";

const Login = (props) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activateLogin, setActivateLogin] = useState(false);
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const recaptchaRef = useRef();

  const router = useRouter();

  const verifyIsUserLoggedIn = () => {
    console.log("LOGIN PAGE AUTH STATE: " + authState);
    if (authState) {
      router.push("/users");
    }
  }

  // useEffect(() => {
  //   verifyIsUserLoggedIn()
  // }, [authState]);


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser();
  }

  const onReCAPTCHAChange = (captchaCode) => {
    if(!captchaCode) {
      console.log("Sorry can't let you in");
    }
    setActivateLogin(true);
    recaptchaRef.current.reset();
    recaptchaRef.current.reset();
  }


  const loginUser = async () => {
    // if (activateLogin) {
      try {
        const userAuth = await signInWithEmailAndPassword(
            auth,
            username+"@yesbpo.com",
            password
        );

        dispatch(setAuthState(true));

        dispatch(setUid(userAuth.user.uid));
        dispatch(setUserName(userAuth.user.email));

        router.push("/users");
      } catch ({message}) {
        console.log("jumped to catch" + message);
        dispatch(setAuthState(false));
        setActivateLogin(false);
      }
    // }
  };

  const loginButtonClasses = classNames(
      "bg-[#345798] w-36 h-16 text-light-lighter rounded-2xl mt-8",
      {
        ['hover:bg-[#2f4784]']: activateLogin,
        ['opacity-30']: !activateLogin
      }
  );

  return (

      <div className="h-screen w-screen flex flex-1 bg-primary items-center">
        <div className="h-3/5 w-1/4 bg-[#f6fffe] rounded-2xl m-auto flex flex-col justify-center items-center">
          <BadgeCheckIcon className="h-56 w-56 text-green"/>
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <input type="text"
                   value={username}
                   onChange={handleUsernameChange}
                   placeholder="nombre de usuario"
                   className="bg-[#e8f5f5] h-16 w-full p-2 m-4 border-1 border-green focus:border-green rounded-2xl"/>
            <input type="password"
                   value={password}
                   onChange={handlePasswordChange}
                   placeholder="contraseña"
                   className="bg-[#e8f5f5] h-16 w-full p-2 m-4 border-1 border-green focus:border-green rounded-2xl"/>

            {/*<ReCAPTCHA*/}
            {/*    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}*/}
            {/*    ref={recaptchaRef}*/}
            {/*    size="normal"*/}
            {/*    onChange={onReCAPTCHAChange}*/}
            {/*/>*/}

            <button
                type="submit"
                className={loginButtonClasses}>
              Iniciar Sesion
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;