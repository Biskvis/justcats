'use client'
import Sidebar from '../components/Sidebar'
import isAuth from '../components/isAuth'
import FavoritesForm from '../components/FavoritesForm'
import '../globals.css'

function Favorites() {

    return (
        <div className='flex flex-row container mx-auto bg-custom-dark'>
            <Sidebar />
            <FavoritesForm />
        </div>
    )
}

export default isAuth(Favorites)