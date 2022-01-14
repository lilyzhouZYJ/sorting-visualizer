import React from "react";
import { getRandomInt } from "./helper";
import { getMergeSortAnimations } from "./algorithms/mergeSort";
import { getQuickSortAnimations } from "./algorithms/quickSort";
import NavBar from "./NavBar";
import Legend from "./Legend";
import * as params from './params';

class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            array: [],
            arraySize: params.ARRAY_DEFAULT_SIZE,
            arrayBarWidth: params.BAR_DEFAULT_WIDTH,
            animationSpeed: params.DEFAULT_ANIMATION_SPEED_MULTIPLIER,
        }
    }

    componentDidMount = () => {
        this.generateArray(this.state.arraySize);
    }

    generateArray = () => {
        const array = [];
        for(let i = 0; i < this.state.arraySize; i++)
            array.push(getRandomInt(params.ARRAY_VALUE_MIN, params.ARRAY_VALUE_MAX));
        // set bar width
        let width;
        if(this.state.arraySize <= 20) width = '30px';
        else if(this.state.arraySize <= 30) width = '25px';
        else if(this.state.arraySize <= 40) width = '20px';
        else if(this.state.arraySize <= 60) width = '15px';
        else if(this.state.arraySize <= 80) width = '10px';
        else if(this.state.arraySize <= 100) width = '7px';
        else if(this.state.arraySize <= 120) width = '6px';
        else if(this.state.arraySize <= 150) width = '5px';
        else if(this.state.arraySize <= 170) width = '4px';
        else if(this.state.arraySize <= 200) width = '3px';
        this.setState( { array: array, arrayBarWidth: width });
    }

    changeArraySize = (e) => {
        this.setState({ arraySize: e.target.value }, this.generateArray);
    }

    changeAnimationSpeed = (e) => {
        const speed = params.MAX_ANIMATION_SPEED_MULTIPLIER - e.target.value 
                                            + params.MIN_ANIMATION_SPEED_MULTIPLIER;
        this.setState( { animationSpeed: speed });
    }

    disableButtons = () => {
        const buttons = document.querySelectorAll('button');
        for(let button of buttons)
            button.disabled = true;

        const inputs = document.querySelectorAll('input');
        for(let input of inputs)
            input.disabled = true;
    }

    enableButtons = () => {
        const buttons = document.querySelectorAll('button');
        for(let button of buttons)
            button.disabled = false;

        const inputs = document.querySelectorAll('input');
        for(let input of inputs)
            input.disabled = false;
    }

    mergeSort = () => {
        this.disableButtons();
        
        // define colors
        const COMPARE_COLOR = 'orange';
        const CHANGE_HEIGHT_COLOR = 'seagreen';
        const SORTED_COLOR = 'seagreen';

        const animations = getMergeSortAnimations(this.state.array);
        let ani_multi = 0;

        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');

            const comparison = animations[i].comparison;
            const changeHeight = animations[i].changeHeight;

            const [bar1, bar2] = comparison;
            const [barInd, newHeight] = changeHeight;

            setTimeout(() => {
                // compare
                arrayBars[bar1].style.backgroundColor = COMPARE_COLOR;
                arrayBars[bar2].style.backgroundColor = COMPARE_COLOR;

                // change height
                arrayBars[barInd].style.backgroundColor = CHANGE_HEIGHT_COLOR;
                arrayBars[barInd].style.height = `${newHeight}px`;
            }, ani_multi * this.state.animationSpeed);
            ani_multi++;

            // revert color changes
            setTimeout(() => {
                arrayBars[bar1].style.backgroundColor = params.BAR_COLOR;
                arrayBars[bar2].style.backgroundColor = params.BAR_COLOR;

                arrayBars[barInd].style.backgroundColor = params.BAR_COLOR;

                // check if this is the last change
                if(i === animations.length-1) {
                    for(let bar of arrayBars)
                        bar.style.backgroundColor = SORTED_COLOR;
                    setTimeout(() => {
                        for(let bar of arrayBars)
                            bar.style.backgroundColor = params.BAR_COLOR;
                        this.enableButtons();
                    }, 1000);
                }
            }, ani_multi * this.state.animationSpeed);
        }
    }

    quickSort = () => {
        this.disableButtons();

        const finishSort = () => {
            setTimeout(() => {
                this.enableButtons();
                const arrayBars = document.getElementsByClassName('array-bar');
                for(let bar of arrayBars)
                    bar.style.backgroundColor = params.BAR_COLOR;
            }, 1000);
        }

        // define colors
        const PIVOT_COLOR = '#0033cc';          // dark blue ish
        const SELECTION_COLOR = 'yellow';       // which number is being compared to pivot
        const SWAP_COLOR = 'orange';            // the number is swapped to the left side of array
        const SORTED_COLOR = 'seagreen';        // numbers in the correct location

        const animations = getQuickSortAnimations(this.state.array);
        let ani_multi = 0;

        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');

            const curr = animations[i];

            if(curr.type === 'pivot') {
                // pivot
                setTimeout(() => {
                    arrayBars[curr.pivot].style.backgroundColor = PIVOT_COLOR;
                    if(i === animations.length - 1) finishSort();
                }, ani_multi * this.state.animationSpeed);
                ani_multi++;
            } else if (curr.type === 'index') {
                // currently examining number
                setTimeout(() => {
                    arrayBars[curr.index].style.backgroundColor = SELECTION_COLOR;
                }, ani_multi * this.state.animationSpeed);
                ani_multi++;

                setTimeout(() => {
                    arrayBars[curr.index].style.backgroundColor = params.BAR_COLOR;
                    if(i === animations.length - 1) finishSort();
                }, ani_multi * this.state.animationSpeed);
            } else if (curr.type === 'swap') {
                // swap: change height and color
                setTimeout(() => {
                    const origHeight0 = arrayBars[curr.swap[0]].style.height;
                    const origHeight1 = arrayBars[curr.swap[1]].style.height;
                    arrayBars[curr.swap[0]].style.height = origHeight1;
                    arrayBars[curr.swap[1]].style.height = origHeight0;
                    arrayBars[curr.swap[0]].style.backgroundColor = SWAP_COLOR;
                    arrayBars[curr.swap[1]].style.backgroundColor = SWAP_COLOR;

                    if(curr.swap[2]){
                        // this is the swap that places pivot at its right position
                        arrayBars[curr.swap[0]].style.backgroundColor = SORTED_COLOR;
                        if(curr.swap[0] !== curr.swap[1])
                            arrayBars[curr.swap[1]].style.backgroundColor = params.BAR_COLOR;
                    }
                }, ani_multi * this.state.animationSpeed);
                ani_multi++;

                // revert color
                setTimeout(() => {
                    if(curr.swap[2] === false)
                        arrayBars[curr.swap[0]].style.backgroundColor = params.BAR_COLOR;
                    if(curr.swap[0] !== curr.swap[1])
                        arrayBars[curr.swap[1]].style.backgroundColor = params.BAR_COLOR;

                    if(i === animations.length - 1) finishSort();
                }, ani_multi * this.state.animationSpeed);
            }
        }
    }

    checkTesting = (arr1, arr2) => {
        for(let i = 0; i < arr1.length; i++)
            if(arr1[i] !== arr2[i])
                return false;
        return true;
    }

    render(){
        const array = this.state.array;

        const sortFunc = {
            quickSort: this.quickSort, 
            mergeSort: this.mergeSort
        };

        return (
            <div>
                <NavBar changeArraySize={this.changeArraySize}
                        changeAnimationSpeed={this.changeAnimationSpeed} 
                        generateArray={this.generateArray}
                        sortFunc={sortFunc} />
                <div id="container">
                    <Legend arraySize={this.state.arraySize} />
                    <div id="array-container">
                        {array.map((value, index) => (
                            <div className="array-bar" 
                                key={index}
                                style={{backgroundColor: params.BAR_COLOR, 
                                        width: this.state.arrayBarWidth, height: `${value}px`}}>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default SortingVisualizer;