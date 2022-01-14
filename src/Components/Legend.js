import React from "react";

class Legend extends React.Component {

    render() {
        return (
            <div id='legend'>
                <p>Array size: {this.props.arraySize}</p>
            </div>
        )
    }
}

export default Legend;