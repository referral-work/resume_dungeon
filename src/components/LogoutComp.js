import { googleLogout } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';

const LogoutComp = () => {
    const navigate = useNavigate();
    const logout = () => {
        googleLogout()
        localStorage.removeItem('google-access-token')
        navigate('/login');
    }
    return (
        <div style={{fontWeight: 500, cursor: 'pointer', fontSize: 18, padding: 10, backgroundColor: 'white', borderRadius: 10}} onClick={logout}>
            Logout
        </div>
    )
}

export default LogoutComp