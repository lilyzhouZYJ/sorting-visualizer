import React from "react";
import * as params from "./params";

class NavBar extends React.Component {
    
    render() {
        const {changeArraySize, changeAnimationSpeed, generateArray, sortFunc} = this.props;

        return (
            <div id="buttons-bar">
                <div id="sort-buttons">
                    <button onClick={sortFunc.mergeSort}>Merge Sort</button>
                    <button onClick={sortFunc.quickSort}>Quick Sort</button>
                </div>
                <div id="generate-array">
                    <button onClick={generateArray}>Generate New Array</button>
                    <label htmlFor="array-size">
                        Array Size
                        <input type="range" id="array-size" name="array-size" 
                                min={params.ARRAY_MIN_SIZE} max={params.ARRAY_MAX_SIZE} 
                                defaultValue={params.ARRAY_DEFAULT_SIZE} step='10'
                                onChange={changeArraySize} />
                    </label>
                    <label htmlFor="animation-speed">
                        Animation Speed
                        <input type="range" id="animation-speed" name="animation-speed"
                                min={params.MIN_ANIMATION_SPEED_MULTIPLIER} max={params.MAX_ANIMATION_SPEED_MULTIPLIER}
                                defaultValue={params.MAX_ANIMATION_SPEED_MULTIPLIER - params.DEFAULT_ANIMATION_SPEED_MULTIPLIER 
                                                            + params.MIN_ANIMATION_SPEED_MULTIPLIER}
                                onChange={changeAnimationSpeed} />
                    </label>
                </div>
            </div>
        )
    }
}

export default NavBar;