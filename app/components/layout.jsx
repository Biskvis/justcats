import Sidebar from './Sidebar'

export default function Layout({ children }) {
    return (
      <div data-theme='bumblebee' className='flex flex-row container mx-auto bg-custom-dark'>
        <Sidebar />
        <main className=''>{children}</main>
      </div>
    )
  }
  