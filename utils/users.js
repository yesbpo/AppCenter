import {firestore} from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const getUsers = async () => {
    const q = query(collection(firestore, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.data()));
}

export {getUsers}