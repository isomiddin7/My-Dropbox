import ProgressBar from 'react-bootstrap/ProgressBar';
import './LoadingBar.css'
import React from 'react'

const LoadinBar = ({loading}) => {
    // const now = 60;
    return (
        <div className='loading'>
            <ProgressBar now={loading} label={`${loading}%`} />
        </div>
    )
}

export default LoadinBar