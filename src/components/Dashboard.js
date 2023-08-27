import { useEffect, useState } from "react"
import { BACKEND_URL } from "../util/constants"
import { makeStyles, CircularProgress } from "@material-ui/core"
import UserLineChart from "./UserLineChart"
import PromptLineChart from "./PromptLineChart"
import PromptPieChart from "./PromptPieChart"

const useStyles = makeStyles((theme) => ({
    container: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    circularLoading: {
        textAlign: 'center',
        margin: 16,
        marginTop: 50
    },
    dashboardContainer: {
        padding: 10,
        marginTop: 50,
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 50,

        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },
    dashboardIUsersContainer: {
        padding: 10,
        borderRadius: 10,
        border: '1px solid lightgrey',
        minHeight: 200,
        minWidth: 400,
        maxWidth: 500,
        marginRight: 'auto',
        marginLeft: 'auto',
        height: 'fit-content',
        
        [theme.breakpoints.down('xs')]: {
            minWidth: 320
        }
    },
    blockTitle: {
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'bold'
    },
    detailsBlock: {
        marginTop: 20
    },
    detailsBlockItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 14,
        marginTop: 10,
    },
    detailsBlockItemLabel: {
        width: 250,
        textAlign: "left",

        [theme.breakpoints.down('xl')]: {
            width: 200
        }
    },
    detailsBlockItemValue: {
        width: 100,
        textAlign: "right",
        paddingRight: 20
    },
    dashboardILogsContainer: {
        padding: 10,
        borderRadius: 10,
        border: '1px solid lightgrey',
        minHeight: 200,
        minWidth: 400,
        maxWidth: 500,
        marginRight: 'auto',
        marginLeft: 'auto',

        [theme.breakpoints.down('sm')]: {
            marginTop: 50
        },

        [theme.breakpoints.down('xs')]: {
            minWidth: 320
        }
    },
}))

const Dashboard = () => {
    const classes = useStyles();
    const [idata, setIData] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        const iUsersResponse = await fetch(`${BACKEND_URL}/api/iusers`);
        const iLogsResponse = await fetch(`${BACKEND_URL}/api/ilogs`);

        const iUsersResponseData = await iUsersResponse.json()
        const iLogsResponseData = await iLogsResponse.json()

        const data = {
            ilogs: iLogsResponseData,
            iusers: iUsersResponseData
        }
        setIData(data)
        setIsLoading(false)
    }

    const getUserUsingPrompt = () => {
        const ilogsSet = new Set(idata.ilogs.map(item => item.email));

        let commonUsers = [];

        idata.iusers.forEach(item => {
            if (ilogsSet.has(item.email)) {
                commonUsers.push(item);
            }
        });
        return commonUsers
    }

    const getUsersJoinedToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const usersJoinedToday = idata.iusers.filter(user => {
            const userCreatedAt = new Date(user.createdAt);
            return userCreatedAt >= today;
        });
        return usersJoinedToday
    }

    const getUsersJoinedWithinLastWeek = () => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        const usersJoinedLastWeek = idata.iusers.filter(user => {
            const userCreatedAt = new Date(user.createdAt);
            return userCreatedAt >= lastWeek && userCreatedAt <= today;
        });
        return usersJoinedLastWeek
    }

    const getCouponCodesUsed = () => {
        const couponCodesUsed = idata.iusers.filter(user => {
            return user.couponUsed
        })
        return couponCodesUsed
    }

    const getPromptsUsed = () => {
        let prompt1Used = [], prompt2Used = [], prompt3Used = [], prompt4Used = [];
        idata.ilogs.forEach((ilog) => {
            if(ilog.prompt.includes("Candidate want to switch into")){
                prompt1Used.push(ilog);
            } else if(ilog.prompt.includes("Now give me  just 1 job profile")){
                prompt2Used.push(ilog);
            } else if(ilog.prompt.includes("Write Linkledln about/ Resume Summary for Candidate")){
                prompt3Used.push(ilog);
            } else if(ilog.prompt.includes("For each candidate return top 3 job profiles that suits them most")){
                prompt4Used.push(ilog);
            }
        })
        return [prompt1Used, prompt2Used, prompt3Used, prompt4Used]
    }
    const getPromptsUsedToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const logsCreatedToday = idata.ilogs.filter(log => {
            const logCreatedAt = new Date(log.createdAt);
            return logCreatedAt >= today;
        });
        return logsCreatedToday
    }

    const getPromptsUsedWithinLastWeek = () => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        const logsCreatedWithinLastWeek = idata.ilogs.filter(log => {
            const logCreatedAt = new Date(log.createdAt);
            return logCreatedAt >= lastWeek && logCreatedAt <= today;
        });
        return logsCreatedWithinLastWeek
    }

    const calculateMetrics = () => {
        const metrics = {
            usersUsingPrompt: getUserUsingPrompt(),
            usersJoinedToday: getUsersJoinedToday(),
            usersJoinedWithinLastWeek: getUsersJoinedWithinLastWeek(),
            couponCodesUsed: getCouponCodesUsed(),
            promptsUsed: getPromptsUsed(),
            promptsUsedToday: getPromptsUsedToday(),
            promptsUsedWithinLastWeek: getPromptsUsedWithinLastWeek()
        }
        setIData({
            iusers: idata.iusers,
            ilogs: idata.ilogs,
            metrics: metrics
        })
    }

    useEffect(() => {
        if (idata === null) {
            setIsLoading(true)
            fetchData()
        } else if (idata.metrics === null || idata.metrics === undefined) {
            calculateMetrics()
        }
    }, [idata])

    return (
        <div className={classes.container}>
            {isLoading &&
                <div className={classes.circularLoading}>
                    <CircularProgress size={32} />
                </div>}
            {idata !== null && idata.metrics !== undefined &&
                <div className={classes.dashboardContainer}>
                    <div className={classes.dashboardIUsersContainer}>
                        <div className={classes.blockTitle}>
                            Users
                        </div>
                        <div className={classes.detailsBlock}>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Total users:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.iusers.length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Users (2 prompts limit):
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.iusers.filter(u => u.currentMaxPromptCount === 2).length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Users (6 prompts limit):
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.iusers.filter(u => u.currentMaxPromptCount === 6).length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Users using prompts:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.usersUsingPrompt.length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Users joined today:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.usersJoinedToday.length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Users joined within last one week:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.usersJoinedWithinLastWeek.length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Coupon Codes Used:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.couponCodesUsed.length}
                                </div>
                            </div>
                            <UserLineChart users={idata.iusers} />
                        </div>
                    </div>
                    <div className={classes.dashboardILogsContainer}>
                        <div className={classes.blockTitle}>
                            Prompts
                        </div>
                        <div className={classes.detailsBlock}>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Total prompts used:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.ilogs.length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Prompt 1 used:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.promptsUsed[0].length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Prompt 2 used:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.promptsUsed[1].length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Prompt 3 used:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.promptsUsed[2].length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Prompt 4 used:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.promptsUsed[3].length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Prompts used today:
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.promptsUsedToday.length}
                                </div>
                            </div>
                            <div className={classes.detailsBlockItem}>
                                <div className={classes.detailsBlockItemLabel}>
                                    Prompts used within last one week
                                </div>
                                <div className={classes.detailsBlockItemValue}>
                                    {idata.metrics.promptsUsedWithinLastWeek.length}
                                </div>
                            </div>
                            <PromptLineChart logs={idata.ilogs} />
                            <PromptPieChart prompts={idata.metrics.promptsUsed}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard