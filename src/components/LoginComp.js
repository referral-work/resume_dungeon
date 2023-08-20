import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import logoImage from '../logo.png'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: 1,
        height: '100vh'
    },
    container: {
        width: "100%",
        border: "1px solid lightgrey",
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.1)',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        [theme.breakpoints.down("sm")]: {
            flexDirection: 'column-reverse',
            justifyContent: 'center'
        },
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(70, 160, 148, 11%)',
        height: '100%',
        width: '50%',
        textAlign: 'left',
        color: '#333131',

        [theme.breakpoints.down("sm")]: {
            width: '100%',
            textAlign: 'center',
            paddingBottom: '50px'
        },
    },
    rightContainer: {
        width: '50%',
        paddingBottom: '100px',

        [theme.breakpoints.down("sm")]: {
            width: '100%',
            paddingBottom: '50px',
            paddingTop: '50px'
        },
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
        marginTop: '40px',
        cursor: 'pointer',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#2050e1',
        color: 'white',
        fontWeight: 500,
        fontSize: 24,
        border: 'none',
        borderRadius: 10,

        [theme.breakpoints.down("xs")]: {
            fontSize: 18
        }
    },
    inputLabel: {
        width: "270px",
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#625757',
        fontSize: 24,
        fontFamily: 'Roboto, sans-serif',

        [theme.breakpoints.down("xs")]: {
            fontSize: 18
        }
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
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 50,
        height: 120,
        display: 'block',

        [theme.breakpoints.down("xs")]: {
            height: 80
        }
    },
    hurryUp: {
        fontSize: 64,
        fontFamily: 'Montserrat',
        paddingLeft: 100,

        [theme.breakpoints.down("sm")]: {
            padding: 0,
            fontSize: 36
        }
    },
    belowHurryUp: {
        padding: 100,
        fontSize: 48,
        fontFamily: 'Opensans sans-serif',
        paddingTop: 50,

        [theme.breakpoints.down("sm")]: {
            padding: 10,
            paddingTop: 30,
            fontSize: 24
        }
    },
    surityBox: {
        fontStyle: 'italic',
        paddingLeft: 15,
        marginTop: 20,
        fontSize: 18,
        width: 270,
        marginLeft: 'auto',
        marginRight: 'auto',

        [theme.breakpoints.down("sm")]: {
            fontSize: 14
        }
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
                        className={classes.hurryUp}>
                        Hurry up!
                    </div>
                    <div
                        className={classes.belowHurryUp}>
                        Start using our awesome prompts now
                    </div>
                </div>
                <div className={classes.rightContainer}>
                    <div>
                        <img className={classes.imageContainer} src={logoImage} />
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
                        className={classes.surityBox}
                    >
                        Relax! We won't bomb you with marketing mails
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComp