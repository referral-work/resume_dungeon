import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    footerContainer: {
        height: 150,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#087566',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: 20,
        fontFamily: 'montserrat,sans-serif',
        paddingBottom: 50
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    }
}))

const FooterComp = () => {
    const classes = useStyles()

    return (
        <div className={classes.footerContainer}>
            <div className={classes.section}>
                <div className={classes.sectionTitle}>
                    Contact
                </div>
                <div style={{
                    fontSize: 16,
                    marginTop: 20
                }}>
                    plopso@gmail.com
                </div>
                <div style={{
                    fontSize: 14,
                    fontStyle: 'italic',
                    marginTop: 20
                }}>
                    Write to us and we will reach back to you within 24 hours
                </div>
                <div style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: 30
                }}>
                    © 2023-2024 Plopso Inc.
                </div>
            </div>
        </div>
    )
}

export default FooterComp