import { collection, endBefore, getCountFromServer, getDocs, limit, orderBy, query, startAfter, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { UIButton } from "../components/PageButton";
import Table from "../components/Table";
import CreateUserModal from "../components/Users/CreateUserModal";
import { selectAuthState } from "../store/authSlice";
import {
    selectCurrentUser,
    selectUserUID,
    selectUserUsername,
    setCurrentUser,
} from "../store/userSlice";
    import { firestore } from "../utils/firebase";

    // User Table Component
    const Users = (props) => {
        const [users, setUsers] = useState([]);
        ;
        const authState = useSelector(selectAuthState);
       
    const verifyUserAuthState = () => {
        if (!authState) {
            router.push("/api/auth/signin");
        }
    };

    useEffect(() => {
        verifyUserAuthState();
    }, [currentUserLogged]);

    
    
    return (
        <Layout>
           
        </Layout>
    );
};

export default Users;