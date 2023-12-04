import React, {useState} from 'react';
import classNames from "classnames";
import {UIButton} from "../PageButton";
import {firestore, storage} from "../../utils/firebase";
import {deleteDoc, doc, collection, setDoc} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {PaperClipIcon} from "@heroicons/react/outline";

const emptyDatasource = {
    name: "",
    group: "",
    type: "",
    sentCount: 0,
    api: "",
    file: ""
}

const CreateDataSourceModal = ({closeModal, editDataSource }) => {

    // Datasource data.
    const selectedDatasource = editDataSource ?? emptyDatasource;
    const [name, setName] = useState("");
    const [group, setGroup] = useState("");
    const [type, setType] = useState("");
    const [file, setFile] = useState(null);
    const [api, setAPI] = useState("");

    // Error handling.
    const [nameError, setNameError] = useState(true);
    const [groupError, setGroupError] = useState(true);
    const [typeError, setTypeError] = useState(true);

    // File explorer
    const [displayFileExplorer, setDisplayFileExplorer] = useState(false);
    function closeModal (){
        setName("");
        setGroup("");
        setType("");
        setNameError(true);
        setGroupError(true);
        setTypeError(true);
        
     }
    // Done button hanlding.
    const handleDone = async () => {
        const nameVerification = name && name.length >= 3;
        const groupVerification = group && group.length >= 3;
        const typeVerification = type && type.length >= 3;

        // Set values for errors;
        setNameError(nameVerification);
        setGroupError(groupVerification);
        setTypeError(typeVerification);
         
        // If verification passes, create Datasource.
        if (nameVerification && groupVerification && typeVerification) {
            try {
                const datasourceRef = collection(firestore, "datasources");
                const docRef = doc(datasourceRef);

                await setDoc(docRef, {
                    name: name,
                    group: group,
                    type: type,
                    sentCount: 0
                }, {merge: true});
                function closeModal (){
                    setName("");
                    setGroup("");
                    setType("");
                    setNameError(true);
                    setGroupError(true);
                    setTypeError(true);
                    
                 }
            closeModal();
            } catch (e) {
                console.log(e);
                setNameError("* Hubo un error guardando en la base de datos.")
            }
        }
    }
    
    // Cancel button handling.
    const close = () => {
        function closeModal (){
            setName("");
            setGroup("");
            setType("");
            setNameError(true);
            setGroupError(true);
            setTypeError(true);
            
         }
        // Reset all values.

    };

    const handleDeleteDataSource = () => {
        // TODO: - Remove datasource using id.
    };

    const buttonDivClasses = classNames(
        "flex justify-between p-8 z-0",
        {
            ['space-x-48']: editDataSource !== null,
            ['space-x-64']: editDataSource === null,
            ['space-x-96']: editDataSource === null
        }
    )

    const attachmentUploadHandler = (e) => {
        setFile(e.target.files[0]);
    }

    const fileExplorerHandler = () => {
        setDisplayFileExplorer(true);
    }

    return (
        <div className="flex flex-col justify-center p-12 bg-light-lighter shadow-2xl rounded-2xl">
            <input
                type="text"
                className="bg-[#e2e3e5] shadow-md w-full h-16 rounded-md p-4 mr-4"
                placeholder="Nombre"
                value={name}
                onChange={(e) => { setName(e.target.value) }}
            />
            { !nameError && <p className="text-red text-bold py-4">* El nombre debe tener al menos 2 caracteres.</p> }
            <div className="flex py-4 flex-row">
                <div className="flex justify-center flex-col">
                    <input
                        type="text"
                        className="bg-[#e2e3e5] shadow-md w-96 h-16 rounded-md mr-4"
                        placeholder="Grupo"
                        value={group}
                        onChange={(e) => { setGroup(e.target.value) }}
                    />
                </div>
                <div className="flex flex-col">
                    <input
                        type="text"
                        className="bg-[#e2e3e5] shadow-md w-96 h-16 rounded-md"
                        placeholder="Tipo"
                        value={type}
                        onChange={(e) => { setType(e.target.value) }}
                    />
                </div>
            </div>
            <input
                type="text"
                className="bg-[#e2e3e5] shadow-md w-full h-16 rounded-md p-4 mr-4"
                placeholder="Link a la api"
                value={api}
                onChange={(e) => { setAPI(e.target.value) }}
            />
            <button className="py-4 rounded-full inline-flex items-center" onClick={fileExplorerHandler}>
                <PaperClipIcon className="h-8 w-8 mr-1" />
                Adjuntar archivo
            </button>
            {displayFileExplorer &&
                <input type="file" name="file" onChange={attachmentUploadHandler} />
            }
            <div className={buttonDivClasses}>
                <UIButton onClick={() => {
                    close()
                }}
                          className="bg-red w-40 h-14 text-light-lighter inline-flex items-center">
                    CANCELAR
                </UIButton>
                {
                    editDataSource !== null &&
                    <UIButton onClick={() => {
                        handleDeleteDataSource()
                    }}
                              className="bg-[#ba574a] w-40 h-14 text-light-lighter inline-flex items-center">
                        ELIMINAR
                    </UIButton>
                }

                <UIButton onClick={() => {
                    handleDone()
                }}
                          className="bg-green w-40 h-14 text-light-lighter inline-flex items-center text-center">
                    {
                        editDataSource === null ? "CREAR" : "GUARDAR"
                    }
                </UIButton>
            </div>
        </div>
    );
};

export default CreateDataSourceModal;
