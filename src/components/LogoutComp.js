import { GoogleLogout } from "react-google-login";
import { useNavigate } from 'react-router-dom';

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID

const LogoutComp = () => {
    const navigate = useNavigate();
    const onSuccess = () => {
        console.log('Log out Successfull!!');
        navigate('/login');
    }
    return (
        <div>
            <GoogleLogout clientId={clientId} buttonText='LogOut' onLogoutSuccess={onSuccess} />
        </div>
    )
}

export default LogoutComp