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
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const pageIndexRef = useRef(0);
    const lastUserVisibleSnapshot = useRef(null);
    const firstUserVisibleSnapshot = useRef(null);
    const fetchIdRef = useRef(0);
    const userName = useSelector(selectUserUsername);
    const authState = useSelector(selectAuthState);
    const dispatch = useDispatch();
    const currentUserLogged = useSelector(selectCurrentUser, shallowEqual);
    const router = useRouter();

    const fetchUsers = useCallback(
        (pageIndex, pageSize) => {
            const fetchId = ++fetchIdRef.current;
            setLoading(true);
            // Only update the data if this is the latest fetch
            if (fetchId === fetchIdRef.current) {
                const isFoward = pageIndexRef.current <= pageIndex
                getUsers(isFoward, pageSize);
                pageIndexRef.current = pageIndex;
            }
        }, [],
    );


    const getUsers = async(isForward, pageSize) => {
        // If we already have a last user visible snapshot it means that will be the first doc for the next page.
        if (lastUserVisibleSnapshot.current !== null) {
            firstUserVisibleSnapshot.current = lastUserVisibleSnapshot.current;
        }

        // Collection.
        const docCollection = collection(firestore, "users");
        // Query reference.
        let qRef;

        if (isForward) {
            lastUserVisibleSnapshot.current === null ?
                qRef = query(
                    docCollection,
                    orderBy("userName"),
                    limit(pageSize)
                ) :
                qRef = query(
                    docCollection,
                    orderBy("userName"),
                    startAfter(lastUserVisibleSnapshot.current),
                    limit(pageSize)
                );
        } else {
            firstUserVisibleSnapshot.current === null ?
                qRef = query(
                    docCollection,
                    orderBy("userName"),
                    limit(pageSize)
                ) :
                qRef = query(
                    docCollection,
                    orderBy("userName"),
                    endBefore(lastUserVisibleSnapshot.current),
                    limit(pageSize)
                );
        }

        // Getting results for query.
        const querySnapshot = await getDocs(qRef);
        setUsers([]);
        let userArray = [];
        querySnapshot.forEach((doc) => {
            const uid = doc.id;
            const { email, userName, role, phone, name, bloodType } = doc.data();
            userArray.push({
                uid,
                email,
                userName,
                role,
                phone,
                name,
                bloodType
            })
        });
        console.log("userarray" + userArray);
        setUsers(userArray)

        // Save reference to the last & first visible users to be able to paginate.
        const snapshotLastVisibleUser = querySnapshot.docs[querySnapshot.docs.length - 1];
        lastUserVisibleSnapshot.current = snapshotLastVisibleUser;

        // Get page count.
        if (pageCount === 0) {
            const snapshot = await getCountFromServer(collection(firestore, "users"));
            setPageCount(Math.ceil(snapshot.data().count / pageSize))
        }

        if (currentUserLogged.role === null || currentUserLogged.role === "") {
            getUserData(userArray);
        }
        setLoading(false)
    }

    const getUserData = async (usersArray) => {
        const currentUser = usersArray.find((user) => user.email === userName);
        if (currentUser !== undefined) {
            dispatch(setCurrentUser(currentUser));
        } else {
            // If we don't get it from the usersArray then we can search for it using the username.
            // Remember the userName is the id + @yesbpo.com that's why we split it.
            const docRef = doc(firestore, "users", userName.split("@")[0]);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                // Save the data as the currentUset.
                // TODO: - dispatch(setCurrentUser(docSnap.data()))
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
    };

    const verifyUserAuthState = () => {
        if (!authState) {
            router.push("/api/auth/signin");
        }
    };

    useEffect(() => {
        verifyUserAuthState();
    }, [currentUserLogged]);

    const columns = React.useMemo(
        () => [{
                Header: "Nombre de usuario",
                accessor: "userName"
            },
            {
                Header: "Nombre",
                accessor: "name",
            },
            {
                Header: "Rol",
                accessor: "role",
            }
        ], []
    );

    const [showModal, setShowModal] = useState(false);
    const data = React.useMemo(() => users, [users]);

    const modalHandler = () => {
        setSelectedUser(null);
        setShowModal(!showModal);
    };

    const modalhandlerEdit = (row) => {
        console.log("user Uid" + row.uid);
        setSelectedUser(row)
        setShowModal(!showModal)
    }
    return (
        <Layout>
            <div className="App" style={{ height: "100%" }}>
                <div className="min-h-screen bg-light text-gray-900" >
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4" >
                        <div className="mt-4" > 
                        {
                            currentUserLogged.role === "Coordinador" &&
                                <div className="flex flex-row max-h-12 justify-between mb-4" >
                                    <UIButton onClick={modalHandler}
                                        className="bg-green w-36 text-light-lighter hover:bg-[#9ec998]" > CREAR </UIButton>
                                </div>
                        }
                            <Table
                                columns={columns}
                                data={data}
                                fetchData={fetchUsers}
                                controlledPageCount={pageCount}
                                loading={loading}
                                handleTapOnRow={modalhandlerEdit} />
                            {
                                showModal &&
                                <div
                                    className="fixed inset-0 flex items-center justify-center bg-text bg-opacity-50 backdrop-blur-sm" >
                                    <CreateUserModal
                                        closeModal={modalHandler}
                                        editUser={selectedUser}
                                    />
                                </div>
                            }
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default Users;