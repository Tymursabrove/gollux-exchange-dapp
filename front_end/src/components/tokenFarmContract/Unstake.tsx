import React, { useState, useEffect } from "react"
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
} from "@material-ui/core"
import { Token } from "../Main"
import { useUnstakeTokens, useStakingBalance } from "../../hooks"
import Alert from "@material-ui/lab/Alert"
import { useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../BalanceMsg"

export interface UnstakeFormProps {
  token: Token
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(2),
  },
  unstakeButton: {
    background: "linear-gradient(135deg, hsl(320, 61%, 26%), hsl(320, 61%, 39%))"
  },
  circularProgress: {
    color: "white"
  }
}))

export const Unstake = ({ token }: UnstakeFormProps) => {
  const { image, address: tokenAddress, name } = token

  const { notifications } = useNotifications()

  const balance = useStakingBalance(tokenAddress)

  const formattedBalance: number = balance
    ? parseFloat(formatUnits(balance, 18))
    : 0

  const formattedInterestBalance = formattedBalance + Math.round(formattedBalance*0.00035*1000) / 1000

  const { send: unstakeTokensSend, state: unstakeTokensState } = useUnstakeTokens()

  const handleUnstakeSubmit = () => {
    return unstakeTokensSend(tokenAddress)
  }

  const [showUnstakeSuccess, setShowUnstakeSuccess] = useState(false)

  const handleCloseSnack = () => {
    showUnstakeSuccess && setShowUnstakeSuccess(false)
  }

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Unstake tokens"
      ).length > 0
    ) {
      !showUnstakeSuccess && setShowUnstakeSuccess(true)
    }
  }, [notifications, showUnstakeSuccess])

  const isMining = unstakeTokensState.status === "Mining"


  const classes = useStyles()

  return (
    <>
      <div className={classes.contentContainer}>
        <BalanceMsg
          label={`Your deposited ${name} balance`}
          amount={formattedBalance}
          tokenImgSrc={image}
        />
        {formattedBalance > 0 ?
        <BalanceMsg
          label={`Interest of 0.35%`}
          amount={formattedInterestBalance}
          tokenImgSrc={image}
        /> : <></>}
        <Button
          className={classes.unstakeButton}
          color="primary"
          variant="contained"
          size="medium"
          onClick={handleUnstakeSubmit}
          disabled={isMining}
        >
          {isMining ? <CircularProgress className={classes.circularProgress} size={26} /> : `Withdraw ${name}`}
        </Button>
      </div>
      <Snackbar
        open={showUnstakeSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Tokens unstaked successfully!
        </Alert>
      </Snackbar>
    </>
  )
}
