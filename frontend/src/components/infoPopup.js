import React from 'react'
import { Button, Popup } from 'semantic-ui-react'

/*popup with info when you hover button */
const InfoPopup = (props) => (
  <Popup content={props.message} className="popup" trigger={<Button className="infoButton">i</Button>} />
)

export default InfoPopup