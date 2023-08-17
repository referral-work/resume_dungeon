import GoogleLogin from 'react-google-login'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';

const clientId = "659883495947-fq1mts0flqj8f69hr6bsfjihbrgvco0l.apps.googleusercontent.com"

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
        marginTop: '20px'
    },
    inputLabel: {
        width: "270px",
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'gray',
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
    const onSuccess = (res) => {
        if (res.profileObj) {
            localStorage.setItem("google-access-token", res.accessToken)
            console.log("LOGIN Success!", res.profileObj?.email);
            navigate(`/validate?email=${res.profileObj?.email}&coupon=${coupon}`);
        }
    }
    
    const onFailure = (res) => {
        console.log("Login Failed!", res);
    }

    useEffect(()=>{
        if(data != null) {
            setCoupon(data.data.prevCouponCode)
            setIsError(data.data.isError)
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
                <GoogleLogin className={classes.signInButton} clientId={clientId} buttonText='Sign In with Google' onSuccess={onSuccess} onFailure={onFailure} cookiePolicy={'single_host_origin'} isSignedIn={true} />
            </div>
        </div>  
    )
}

export default LoginComp