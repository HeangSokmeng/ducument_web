// import  from 'react'
import { Outlet } from 'react-router-dom';
import '../../index.css';

export default function MainLayoutAuth() {
    return (
        <div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}
