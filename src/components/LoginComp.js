import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import logoImage from '../logo.png'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: 1,
        height: '100vh'
    },
    container: {
        width: "600px",
        border: "1px solid lightgrey",
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.1)',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        height: '400px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        justifyContent: 'space-between'
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(70, 160, 148, 11%)',
        height: '100%',
        width: 300,
        textAlign: 'left'
    },
    rightContainer: {
        width: 300
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
    },
    imageContainer: {
        textAlign: 'center',
        marginBottom: 30
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

    useEffect(() => {
        if (data != null) {
            setCoupon(data.data.prevCouponCode)
            setIsError(data.data.isError)
            localStorage.removeItem('google-access-token')
        }
        const userAccessToken = localStorage.getItem('google-access-token')
        if (userAccessToken !== null && userAccessToken !== undefined) {
            fetchGoogleProfile(userAccessToken)
        }
    }, [])
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.leftContainer}>
                    <div
                    style={{
                        fontSize: 36,
                        fontFamily: 'Montserrat',
                        paddingLeft: 20
                    }}>
                        Hurry up!
                    </div>
                    <div style={{
                        padding: 20,
                        fontSize: 20,
                        fontFamily: 'Opensans sans-serif'
                    }}>
                        Start using our awesome prompts now
                    </div>
                </div>
                <div className={classes.rightContainer}>
                    <div className={classes.imageContainer}>
                        <img src={logoImage} height={60} />
                    </div>
                    <div>
                        {isError && <div
                            className={classes.errorBlock}
                        >
                            Coupon code is invalid!
                        </div>}
                        <div className={classes.inputLabel}>Coupon Code (Optional)</div>
                        <input className={classes.couponInput} value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                    </div>
                    <button className={classes.signInButton} onClick={login}>
                        Sign in with Google
                    </button>
                    <div
                        style={{
                            fontStyle: 'italic',
                            paddingLeft: 15,
                            marginTop: 20,
                            fontSize: 14
                        }}
                    >
                        Relax! we won't bomb you with marketing mails
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComp