
export function getMergeSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) 
        return array;
    mergeSort(array, 0, array.length-1, animations);
    return animations;
}

function mergeSort(array, start, end, animations=[]){
    if(start === end) return;

    const midpoint = Math.floor((start + end) / 2);
    mergeSort(array, start, midpoint, animations);
    mergeSort(array, midpoint+1, end, animations);
    // merge
    merge(array, start, midpoint, end, animations);
}

function merge(array, start, midpoint, end, animations=[]){    
    // tmp arrays
    const left = [];
    const right = [];
  
    for(let i = start; i <= midpoint; i++)
        left.push(array[i]);
    for(let j = midpoint+1; j <= end; j++)
        right.push(array[j]);
  
    // merge into array
    let arrayInd = start, i = 0, j = 0;

    while(i < left.length && j < right.length){
        if(left[i] < right[j]) {
            // overwrite the value at arrayInd with the value of left[i]
            animations.push({
                comparison: [i+start, j+midpoint+1],
                changeHeight: [arrayInd, left[i]]
            });
            array[arrayInd++] = left[i++];
        } else {
            // overwrite the value at arrayInd with the value of right[j];
            animations.push({
                comparison: [i+start, j+midpoint+1],
                changeHeight: [arrayInd, right[j]]
            });
            array[arrayInd++] = right[j++];
        }
    }

    // remaining items
    while(i < left.length) {
        // overwrite the value at arrayInd with the value of left[i]
        animations.push({
            comparison: [i+start, i+start],
            changeHeight: [arrayInd, left[i]]
        });
        array[arrayInd++] = left[i++];
    }
    while(j < right.length) {
        // overwrite the value at arrayInd with the value of right[j];
        animations.push({
            comparison: [j+midpoint+1, j+midpoint+1],
            changeHeight: [arrayInd, right[j]]
        });
        array[arrayInd++] = right[j++];
    }
}