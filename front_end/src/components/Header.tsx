import { Button, makeStyles, CircularProgress } from "@material-ui/core"
import { useEthers } from "@usedapp/core"
import { useIssueSingleToken } from "../hooks"


const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    },
    getTokenButton: {
        background: "linear-gradient(135deg, hsl(303, 100%, 31%), hsl(350, 61%, 39%))",
        color: "white"
    },
    circularProgress: {
        color: "white"
    }
}))


export const Header = () => {
    const classes = useStyles()

    const { account, activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    const { send: issueSingleTokenSend, state: issueSingleTokenState } = useIssueSingleToken()

    const handleIssueToken = () => {
        return issueSingleTokenSend(account)
    }

    const isMining = issueSingleTokenState.status === "Mining"

    return (
        <div className={classes.container}>
            {isConnected ? (
                <Button
                    className={classes.getTokenButton}
                    variant="contained"
                    onClick={handleIssueToken}
                >
                    {isMining ? <CircularProgress className={classes.circularProgress} size={26} /> : `Get 1 GOL`}
                </Button>
            ) : (<></>)}
            {isConnected ? (
                <Button variant="contained" onClick={deactivate}>
                    Disconnect
                </Button>
            ) : (
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => activateBrowserWallet()}
                >
                    Connect
                </Button>
            )}
        </div>
    )
}