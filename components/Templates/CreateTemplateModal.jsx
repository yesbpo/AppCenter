import React, { useState } from 'react';
import classNames from "classnames";
import { UIButton } from "../PageButton";
import { firestore, storage } from "../../utils/firebase";
import { deleteDoc, doc, collection, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PaperClipIcon } from "@heroicons/react/outline";

const emptyTemplate = {
    message: "",
    approved: false,
    attachment: "",
    sentCount: 0
};

const CreateTemplateModal = ({ closeModal, editTemplate }) => {

    // Template data.
    const selectedTemplate = editTemplate ?? emptyTemplate;
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);

    // Error handling.
    const [messageError, setMessageError] = useState(true);
    const [attachmentError, setAttachmentError] = useState(true);

    // File explorer
    const [displayFileExplorer, setDisplayFileExplorer] = useState(false);

    // Done button handling.
    const handleDone = async () => {
        const messageVerification = message && message.length >= 3;
        const attachmentVerification = true;

        // Set values for errors;
        setMessageError(messageVerification);
        setAttachmentError(attachmentVerification);

        // If verification passes, create Template.
        if (messageVerification && attachmentVerification) {
            try {
                const templateRef = collection(firestore, "templates");
                const docRef = doc(templateRef);

                const storageRef = ref(storage, "attachments/" + docRef.id);
                await uploadBytes(storageRef, file)

                const downloadURL = await getDownloadURL(storageRef);

                await setDoc(docRef, {
                    message: message,
                    attachment: downloadURL,
                    approved: false,
                    sentCount: 0
                }, { merge: true });

                close();
            } catch (e) {
                console.log(e);
                setMessageError("* Hubo un error guardando el adjunto de la plantilla.")
            }
        }
    }

    // Cancel button handling.
    const close = () => {
        // Reset all values.
        setMessage("");
        setFile("");
        setMessageError(true);
        setAttachmentError(true);

        // Close modal and navigate back.
        closeModal();
    }

    // Handle deletion.
    const hanldeDeleteTemplate = async () => {
        try {
            // TODO: - Add the UID.
            await deleteDoc(doc(firestore, "templates"));
            close();
        } catch ({ messageDeleting }) {
            console.log("Couldn't delete the template: " + messageDeleting);
        }
    }

    const buttonDivClasses = classNames(
        "flex justify-between p-8 z-0",
        {
            ['space-x-48']: editTemplate !== null,
            ['space-x-64']: editTemplate === null,
            ['space-x-96']: editTemplate === null
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
            <div className="flex justify-center p-4 flex-col">
                <textarea type="text"
                    className="bg-[#e2e3e5] shadow-md w-full h-64 rounded-md p-4 mr-4 text-left align-top"
                    placeholder="Mensaje"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }} />
                {!messageError && <p className="text-red text-bold">* El mensaje debe contener al menos 2 palabras.</p>}
                <button className="px-4 rounded-full inline-flex items-center" onClick={fileExplorerHandler}>
                    <PaperClipIcon className="h-8 w-8 mr-1" />
                    Adjuntar archivo
                </button>
                {displayFileExplorer &&
                    <input type="file" name="file" onChange={attachmentUploadHandler} />
                }
            </div>
            <div className={buttonDivClasses}>
                <UIButton onClick={() => {
                    close()
                }}
                    className="bg-red w-40 h-14 text-light-lighter inline-flex items-center">
                    CANCELAR
                </UIButton>
                {
                    editTemplate !== null &&
                    <UIButton onClick={() => {
                        hanldeDeleteTemplate()
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
                        editTemplate === null ? "CREAR" : "GUARDAR"
                    }
                </UIButton>
            </div>
        </div>
    );
};

export default CreateTemplateModal;
