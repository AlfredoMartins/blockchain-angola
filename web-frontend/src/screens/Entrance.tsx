import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Login from './Login';
import SideBarComponent from '@/components/SidebarComponent';
import Container from '@/components/Container';
import { loadImages } from '@/services/firebase';

function Entrance() {
    const { authState, isLoggedIn, setImageList  } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        isLoggedIn!();
        if (!authState?.authenticated) {
            navigate('/');
        }

        loadImages(setImageList);
    }, []);

    return (
        <div className='flex flex-col gap-2 w-screen h-screen'>
            {authState?.authenticated && (
                <div className='flex flex-row'>
                    <div>
                        <SideBarComponent />
                    </div>

                    <div className='pl-60 w-screen'>
                        <div className='p-3' style={{ backgroundColor: '#FAFAFA' }}>
                            <Container />
                        </div>
                    </div>

                </div>
            )}

            {!authState?.authenticated && (
                <Login />
            )}
        </div>

    )
}

export default Entrance;
