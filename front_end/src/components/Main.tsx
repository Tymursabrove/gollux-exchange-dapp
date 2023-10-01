import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import gollux from "../gollux.png"
import eth from "../eth.png"
import dai from "../dai.png"
import { YourWallet } from "./yourWallet"
import { Snackbar, Typography, makeStyles, Badge } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { TokenFarmContract } from "./tokenFarmContract"
import React, { useEffect, useState } from "react"


export type Token = {
    image: string
    address: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
    },
    imgWrapper: {
        width: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing(4),
    },
    tokenImg: {
        width: "70px",
        height: "max-content"
    },
    badgeWrapper: {
        background: "linear-gradient(135deg, hsl(313, 61%, 23%), hsl(313, 61%, 36%), hsl(313, 61%, 49%))",
        padding: "2px 5px 2px 5px",
        paddingBottom: "5px",
        borderRadius: "10px",
        marginLeft: "10px",
        height: "max-content",
        width: "max-content",
        display: 'flex',
        justifyContent: "center",
        color: "white",
        fontSize: "13px",
        fontWeight: 600,
    }
}))

export const Main = () => {
   
    const classes = useStyles()
    const { chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"
    let stringChainId = String(chainId)
    const golluxTokenAddress = chainId ? networkMapping[stringChainId]["GolluxToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero // brownie config
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {
            image: gollux,
            address: golluxTokenAddress,
            name: "GOL"
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]

    const [showNetworkError, setShowNetworkError] = useState(false)

    const handleCloseNetworkError = (
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return
        }
        showNetworkError && setShowNetworkError(false)
    }

    useEffect(() => {
        if (error && error.name === "UnsupportedChainIdError") {
          !showNetworkError && setShowNetworkError(true)
        } else {
          showNetworkError && setShowNetworkError(false)
        }
    }, [error, showNetworkError])

    return (
    <>
        <div className={classes.imgWrapper}>
            <img className={classes.tokenImg} src={gollux} alt="token logo" />
            <h2 className={classes.title}>Gollux Exchange</h2>
            <div className={classes.badgeWrapper}><span>KOVAN</span></div>
        </div>
        <YourWallet supportedTokens={supportedTokens} />
        <TokenFarmContract supportedTokens={supportedTokens} />
        <Snackbar
            open={showNetworkError}
            autoHideDuration={5000}
            onClose={handleCloseNetworkError}
        >
            <Alert onClose={handleCloseNetworkError} severity="warning">
            You have to connect to the Kovan network!
            </Alert>
        </Snackbar>
    </>
    )
}