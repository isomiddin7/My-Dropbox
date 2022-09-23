import React, { useEffect, useState } from 'react';
import { FaFileMedical} from 'react-icons/fa';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { updateDoc, doc, onSnapshot} from 'firebase/firestore';
import { HiBackspace } from 'react-icons/hi'
import { useParams, useNavigate } from 'react-router-dom';
import './Folder.css';
import LoadinBar from './LoadinBar';

const Folder = ({ db }) => {
    const storage = getStorage();
    let params = useParams();
    let navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(null);
    const [name, setName] = useState('')
    const dataRef = doc(db, 'dropboxData', params?.id);
    const metadata = {
        contentType: 'image/jpeg'
    };
    const fileUpload = (e) => {
        const uploadRef = ref(storage,  e.target.files[0].name);
        const uploadTask = uploadBytesResumable(uploadRef, e.target.files[0], metadata);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(Math.round(progress));
                setLoading(Math.round(progress))
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        alert('Something went wrong')
                        break;
                }
            },
            (error) => {
                console.log(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setLoading(null)
                    updateDoc(dataRef, {
                        fileLink: [...folders, { 
                            downloadURL: downloadURL, 
                            fileName: e.target.files[0].name
                        }],
                    })
                });
            }
        );
    }

    const read = () => {
        onSnapshot(dataRef, (doc) => {
            setFolders(doc.data().fileLink);
            setName(doc.data().folder);
        })
    }
    useEffect(() => {
        read();
    }, [])

    const openFile = (downloadURL) => {
        window.open(downloadURL, '_blank');
    }
    
    const navigateBack = () => {
        navigate('/dropbox');
    }
    return (
        <div>
            <div className='back'>
                <HiBackspace size={50} onClick={navigateBack}/>
            </div>
            <div className='icons-images'>
                <div className="upload-btn-wrapper">
                    <FaFileMedical
                        className='icon-upload'
                        size={45}
                    />
                    <input type="file" name="myfile" onChange={fileUpload} />
                </div>
            </div>
            <div className='title'>
                <h2>{name}</h2>
            </div>
            {loading ? (
                <LoadinBar loading={loading}/>
            ) : (
                <></>
            )}
            
            <div className='parent'>
                {folders?.map((f) => {
                    return (
                        <>
                            {f.downloadURL !== '' ? (
                                <div className='child2' onClick={() => openFile(f.downloadURL)}>
                                    <h6><FaFileMedical size={50} />{f.fileName}</h6>
                                </div>
                            ) : (
                                ""
                            )}
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default Folder