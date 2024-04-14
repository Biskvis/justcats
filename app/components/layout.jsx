import Sidebar from './Sidebar'
import { ToastContainer } from 'react-toastify'

export default function Layout({ children }) {
    return (
      <div data-theme='bumblebee' className='flex flex-row container mx-auto bg-custom-dark'>
        <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
        <Sidebar />
        <main className=''>{children}</main>
      </div>
    )
  }
  