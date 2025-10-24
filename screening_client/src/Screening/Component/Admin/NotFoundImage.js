import React from 'react'
import notfound from '../../Images/Notfound.png'
import './NotFoundImage.css'

const NotFoundImage = () => {
    return (
        <div>
            <div class="container text-center">
                <div class="row">
                    <div class="col-md-5">
                        <h1 className="pagenotfound">Page Not Found</h1>
                    </div>
                    <div class="col-md-6">
                        <img src={notfound} className='notfound' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFoundImage
