import React, { useState, useEffect } from 'react';
import { FaFolderPlus, FaFileMedical } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom'
import { RiLogoutBoxFill } from 'react-icons/ri';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import LoadinBar from './LoadinBar';
import './Dropbox.css'

const Dropbox = ({ db }) => {
    const [show, setShow] = useState(false);
    const storage = getStorage();
    const [loading, setLoading] = useState(null);
    let user = getAuth()
    const [folder, setFolder] = useState('');
    const [folders, setFolders] = useState([]);
    const collectionRef = collection(db, 'dropboxData');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let navigate = useNavigate();
    const metadata = {
        contentType: 'image/jpeg'
    };

    const uploadFolder = () => {
        addDoc(collectionRef, {
            folder: folder,
            fileLink: [{
                downloadURL: '',
                fileName: '',
            }],
            userId: user.currentUser.uid,
        }).then(() => {
            setShow(false)
            setFolder('')
        }).catch(err => {
            alert(err.message)
        })
    }
    // const fileUpload = (e) => {
    //     const uploadRef = ref(storage, e.target.files[0].name);
    //     const uploadTask = uploadBytesResumable(uploadRef, e.target.files[0], metadata);
    //     uploadTask.on('state_changed',
    //         (snapshot) => {
    //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //             console.log(Math.round(progress));
    //             setLoading(Math.round(progress))
    //             switch (snapshot.state) {
    //                 case 'paused':
    //                     console.log('Upload is paused');
    //                     break;
    //                 case 'running':
    //                     console.log('Upload is running');
    //                     break;
    //                 default:
    //                     alert('Something went wrong')
    //                     break;
    //             }
    //         },
    //         (error) => {
    //             console.log(error.message);
    //         },
    //         () => {
    //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                 setLoading(null)
    //                 addDoc(collectionRef, {
    //                     fileName: e.target.files[0].name,
    //                     downloadURL: downloadURL
    //                 })
    //             });
    //         }
    //     );
    // }

    const read = () => {
        onSnapshot(collectionRef, (data) => {
            const realData = data.docs.filter((item) => {
                return item.data().userId === user.currentUser.uid;
            });
            setFolders(realData);
        })
    }

    const enterFolder = (id) => {
        navigate(`/folder/${id}`)
    }
    // const openFile = (downloadURL) => {
    //     window.open(downloadURL, '_blank');
    // }
    const logOut = () => {
        signOut(user).then(() => {
            navigate('/')
        }).catch(err => alert(err.message));

    }
    const isAuth = () => {
        onAuthStateChanged(user, (u) => {
            if (u) {
                navigate('/dropbox')
            } else {
                navigate('/')
            }
        });
    }

    useEffect(() => {
        read();
        isAuth();
    }, [])

    return (   
        
        <div>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand>Welcome to My DropBox</Navbar.Brand>
                    <Nav className="icons-images">
                        {/* <div className='upload-btn-wrapper'>
                            <FaFileMedical
                                className='icon-upload'
                                size={45}
                                style={{ color: 'black' }}
                            />
                            <input type="file" name="myfile" onChange={fileUpload} />

                        </div> */}

                        <Nav.Link>
                            <FaFolderPlus
                                className='icon-upload'
                                size={50}
                                onClick={handleShow}
                                style={{ color: 'black' }}
                            />
                        </Nav.Link>
                        <Nav.Link>
                            <RiLogoutBoxFill
                                size={45} className='exit'
                                onClick={logOut}
                                style={{ cursor: 'pointer', color: 'black' }}
                            />
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className='loader'>
                {loading ? (
                    <LoadinBar loading={loading} />
                ) : (
                    <></>
                )}
            </div>
            <div className='parent'>
                {folders?.map((item) => {
                    return (
                        <div>
                            <div className='child' onClick={() => enterFolder(item.id)}>
                                <FaFolderPlus size={50}/>  
                                {item.data().folder}
                            </div>
                            {/* {item.data().fileLink.map((file) => {
                                return (
                                    <div className='file' key={file.downloadURL}>
                                        <div className='file-name' onClick={() => openFile(file.downloadURL)}>
                                            {file.fileName}
                                        </div>
                                    </div>
                                )
                            })} */}
                     </div>
                    )
                })}
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Enter folder name"
                            aria-label="Enter folder name"
                            onChange={(e) => setFolder(e.target.value)}
                            value={folder}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={uploadFolder}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Dropbox

// {folders?.map((f, i) => {
//     return (
//         <div className='child' onClick={()  => f.folder ? enterFolder(f.id) : openFile(f.downloadURL)} key={i}>
//             <h5>
//                 {f.folder ?
//                     <div>
//                         <FaFolderPlus size={50} />
//                         {f.folder}
//                     </div>
//                     : <div>
//                         <FaFileMedical size={50} />
//                         {f.fileName}
//                     </div>
//                 }
//             </h5>
//         </div>
//     )
// })}