import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import { useGoogleLogout } from 'react-google-login';

const clientId = "659883495947-fq1mts0flqj8f69hr6bsfjihbrgvco0l.apps.googleusercontent.com"

const ValidateComp = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);

    const coupon = queryParams.get('coupon');
    const email = queryParams.get('email')
    const navigate = useNavigate();
    if(email === null){
        navigate('/login')
    }
    const [userIp, setUserIp] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { signOut } = useGoogleLogout({
        clientId,
        onLogoutSuccess: () => {
            navigate(`/login`, { state: {data: {isError: true, prevCouponCode: coupon}}});
        },
      });

    useEffect(() => {
        async function fetchIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                if (data) {
                    setUserIp(data.ip);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchIP()
    }, []);

    useEffect(()=>{
        async function validateUser() {
            if(userIp !== null){
                try {
                    setIsLoading(true);
                    const reqBody = {
                        data: {
                            email: email,
                            coupon_code: (coupon.length === 0)?null:coupon,
                            ip: userIp
                        }
                    }
                    const response = await axios.post(`/api/user/validate`, JSON.stringify(reqBody), {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (response.status === 200) {
                        setIsLoading(false);
                        let data = response.data
                        data.email = email;
                        data.ip = userIp;
                        navigate(`/home`, { state: {data}});
                    }
    
                } catch (error) {
                    setIsLoading(false)
                    if(error.response.status === 400) {
                        localStorage.removeItem("google-access-token")
                        signOut()
                    }
                }
            }
        }
        validateUser();
    }, [userIp])

    return (
        <>
            {isLoading && <div style={{
                                textAlign: 'center',
                                margin: 16,
                                marginTop: 60
                                }}>
            <CircularProgress size={32} />
            </div>}
        </>
    )
}

export default ValidateComp