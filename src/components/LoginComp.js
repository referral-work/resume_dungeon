import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: 1,
        height: '100vh',
        flexDirection: 'column',
        alignItems: 'center'
    },

    container: {
        width: "300px",
        border: "1px solid lightgrey",
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.1)',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '20px',
        marginTop: 'auto',
        marginBottom: 'auto',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 15,
        justifyContent: 'center'
    },
    couponInput: {
        width: "260px",
        padding: 5,
        height: '25px',
        border: "1px solid lightgrey",
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10px',
        borderRadius: 5,
        fontSize: 14,
        textTransform: 'uppercase'
    },
    signInButton: {
        width: "270px",
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
        cursor: 'pointer',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#2050e1',
        color: 'white',
        fontWeight: 500,
        fontSize: 16,
        border: 'none',
        borderRadius: 10
    },
    inputLabel: {
        width: "270px",
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#625757',
        fontFamily: 'Roboto, sans-serif'
    },
    errorBlock: {
        width: "270px",
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'red',
        marginBottom: 20
    }
  }));

const LoginComp = () => {
    const [coupon, setCoupon] = useState('');
    const [isError, setIsError] = useState(false)
    const classes = useStyles()
    const navigate = useNavigate();
    const location = useLocation()
    const data = location.state

    function navigateToValidate(data) {
        navigate(`/validate?email=${data.email}&coupon=${coupon}`);
    }

    function fetchGoogleProfile(access_token) {
        axios
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                navigateToValidate(res.data)
            })
            .catch((err) => console.log(err));
    }

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            localStorage.setItem("google-access-token", codeResponse.access_token)
            fetchGoogleProfile(codeResponse.access_token)
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(()=>{
        if(data != null) {
            setCoupon(data.data.prevCouponCode)
            setIsError(data.data.isError)
            localStorage.removeItem('google-access-token')
        }
        const userAccessToken = localStorage.getItem('google-access-token')
        if(userAccessToken !== null && userAccessToken !== undefined) {
            fetchGoogleProfile(userAccessToken)
        }
    }, [])
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div>
                    {isError && <div
                        className={classes.errorBlock}
                    >
                        Coupon code is invalid!
                        </div>}
                    <div className={classes.inputLabel}>Coupon Code (Optional)</div>
                    <input className={classes.couponInput} value={coupon} onChange={(e) => setCoupon(e.target.value)}/>
                </div>
                <button className={classes.signInButton} onClick={login}>
                        Sign in with Google
                </button>
            </div>
        </div>  
    )
}

export default LoginComp