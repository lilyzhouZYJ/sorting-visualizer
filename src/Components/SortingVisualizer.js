import React from "react";
import { getRandomInt } from "./helper";
import { getMergeSortAnimations } from "./algorithms/mergeSort";
import { getQuickSortAnimations } from "./algorithms/quickSort";

const ARRAY_DEFAULT_SIZE = 100;
const ARRAY_MIN_SIZE = 10;
const ARRAY_MAX_SIZE = 200;
const ARRAY_VALUE_MIN = 10;
const ARRAY_VALUE_MAX = 600;

const BAR_DEFAULT_WIDTH = '5px';

const DEFAULT_ANIMATION_SPEED_MULTIPLIER = 20;
const MIN_ANIMATION_SPEED_MULTIPLIER = 1;
const MAX_ANIMATION_SPEED_MULTIPLIER = 100;

const BAR_COLOR = 'cornflowerblue';

class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            array: [],
            arraySize: ARRAY_DEFAULT_SIZE,
            arrayBarWidth: BAR_DEFAULT_WIDTH,
            animationSpeed: DEFAULT_ANIMATION_SPEED_MULTIPLIER,
        }
    }

    componentDidMount = () => {
        this.generateArray(this.state.arraySize);
    }

    generateArray = () => {
        const array = [];
        for(let i = 0; i < this.state.arraySize; i++)
            array.push(getRandomInt(ARRAY_VALUE_MIN, ARRAY_VALUE_MAX));
        // set bar width
        let width;
        if(this.state.arraySize <= 20) width = '30px';
        else if(this.state.arraySize <= 30) width = '25px';
        else if(this.state.arraySize <= 40) width = '20px';
        else if(this.state.arraySize <= 60) width = '15px';
        else if(this.state.arraySize <= 80) width = '10px';
        else if(this.state.arraySize <= 100) width = '8px';
        else if(this.state.arraySize <= 120) width = '7px';
        else if(this.state.arraySize <= 150) width = '6px';
        else if(this.state.arraySize <= 170) width = '5px';
        else if(this.state.arraySize <= 200) width = '3px';
        this.setState( { array: array, arrayBarWidth: width });
    }

    changeArraySize = (e) => {
        this.setState({ arraySize: e.target.value }, this.generateArray);
    }

    changeAnimationSpeed = (e) => {
        const speed = MAX_ANIMATION_SPEED_MULTIPLIER - e.target.value + MIN_ANIMATION_SPEED_MULTIPLIER;
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
                arrayBars[bar1].style.backgroundColor = BAR_COLOR;
                arrayBars[bar2].style.backgroundColor = BAR_COLOR;

                arrayBars[barInd].style.backgroundColor = BAR_COLOR;

                // check if this is the last change
                if(i === animations.length-1) this.enableButtons();
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
                    bar.style.backgroundColor = BAR_COLOR;
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
                    arrayBars[curr.index].style.backgroundColor = BAR_COLOR;
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
                            arrayBars[curr.swap[1]].style.backgroundColor = BAR_COLOR;
                    }
                }, ani_multi * this.state.animationSpeed);
                ani_multi++;

                // revert color
                setTimeout(() => {
                    if(curr.swap[2] === false)
                        arrayBars[curr.swap[0]].style.backgroundColor = BAR_COLOR;
                    if(curr.swap[0] !== curr.swap[1])
                        arrayBars[curr.swap[1]].style.backgroundColor = BAR_COLOR;

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

        return (
            <div>
                <div id="buttons-bar">
                    <button onClick={() => this.generateArray()}>Generate New Array</button>
                    <button onClick={() => this.mergeSort()}>Merge Sort</button>
                    <button onClick={() => this.quickSort()}>Quick Sort</button>
                    <label htmlFor="array-size">
                        Array Size
                        <input type="range" id="array-size" name="array-size" 
                                min={ARRAY_MIN_SIZE} max={ARRAY_MAX_SIZE} 
                                defaultValue={ARRAY_DEFAULT_SIZE}
                                onChange={this.changeArraySize} />
                    </label>
                    <label htmlFor="animation-speed">
                        Animation Speed
                        <input type="range" id="animation-speed" name="animation-speed"
                                min={MIN_ANIMATION_SPEED_MULTIPLIER} max={MAX_ANIMATION_SPEED_MULTIPLIER}
                                defaultValue={MAX_ANIMATION_SPEED_MULTIPLIER - DEFAULT_ANIMATION_SPEED_MULTIPLIER + MIN_ANIMATION_SPEED_MULTIPLIER}
                                onChange={this.changeAnimationSpeed} />
                    </label>
                    {/* <button onClick={() => this.quickSort()}>Quick Sort</button>
                    <button onClick={() => this.heapSort()}>Heap Sort</button>
                    <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
                    <button onClick={() => this.testSortingAlgorithms()}>
                        Test Sorting Algorithms (BROKEN)
                    </button> */}
                </div>
                <div id="array-container">
                    {array.map((value, index) => (
                        <div className="array-bar" 
                            key={index}
                            style={{backgroundColor: BAR_COLOR, 
                                    width: this.state.arrayBarWidth, height: `${value}px`}}>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default SortingVisualizer;