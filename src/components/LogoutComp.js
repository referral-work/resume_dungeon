import { GoogleLogout } from "react-google-login";
import { useNavigate } from 'react-router-dom';

const clientID = "659883495947-fq1mts0flqj8f69hr6bsfjihbrgvco0l.apps.googleusercontent.com"

const LogoutComp = () => {
    const navigate = useNavigate();
    const onSuccess = () => {
        console.log('Log out Successfull!!');
        navigate('/login');
    }
    return (
        <div>
            <GoogleLogout clientId={clientID} buttonText='LogOut' onLogoutSuccess={onSuccess} />
        </div>
    )
}

export default LogoutComp