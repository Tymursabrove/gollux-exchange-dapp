import React, { useState } from "react"
import { useEthers } from "@usedapp/core"
//import { StakeForm } from "./StakeForm"
import { Tab, makeStyles, Box } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Token } from "../Main"
import { WalletBalance } from "./WalletBalance"
import { StakeForm } from "./StakeForm"
import { ConnectionRequiredMsg } from "../ConnectionRequiredMsg"

interface YourWalletProps {
  supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px",
    padding: theme.spacing(2),
  },
  header: {
    color: "black",
    fontSize: "17px",
    fontWeight: 700,
    margin: "10px"
  }
}))

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
  
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue))
  }

  const { account } = useEthers()

  const isConnected = account !== undefined

  const classes = useStyles()

  return (
    <Box>
      <Box className={classes.box}>
        <div>
          {isConnected ? (
            <div>
              <span className={classes.header}>Wallet</span>
              <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} aria-label="stake form tabs">
                  {supportedTokens.map((token, index) => {
                    return (
                      <Tab
                        label={token.name}
                        value={index.toString()}
                        key={index}
                      />
                    )
                  })}
                </TabList>
                {supportedTokens.map((token, index) => {
                  return (
                    <TabPanel value={index.toString()} key={index}>
                      <div className={classes.tabContent}>
                        <WalletBalance token={supportedTokens[selectedTokenIndex]}/>
                        <StakeForm token={supportedTokens[selectedTokenIndex]} />
                      </div>
                    </TabPanel>
                  )
                })}
              </TabContext>
            </div>
          ) : (
            <ConnectionRequiredMsg />
          )}
        </div>
      </Box>
    </Box>
  )
}
