import React from 'react'
import { Dropdown } from 'semantic-ui-react'


const DropdownExampleSelection = (props) => {
    let dropDown = (<Dropdown
        placeholder = 'Select Algorithm'
        fluid
        selection
        options={props.algorithmOptions}
    />);
    if(props.text){
        dropDown = (<Dropdown
            text ={props.text}
            fluid
            selection
            options={props.algorithmOptions}
        />);
    }
    return(
            <>
            {dropDown}
            </>
    );
};




export default DropdownExampleSelection;