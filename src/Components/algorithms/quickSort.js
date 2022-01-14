export function getQuickSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) 
        return array;
    quickSort(array, 0, array.length-1, animations);
    return animations;
}

export function quickSort(array, start, end, animations=[]){
    if(start === end){
        animations.push({
            type: 'swap',
            swap: [start, end, true]
        })
    }
    if(start < end){
        const pivotInd = partition(array, start, end, animations);
        quickSort(array, start, pivotInd-1, animations);
        quickSort(array, pivotInd+1, end, animations);
    }
}

function partition(array, start, end, animation) {
    
    // pivot
    const pivot = array[end];
    animation.push({
        type: 'pivot',
        pivot: end,
    });

    // next index to place value smaller than pivot
    let next = start;

    for(let i = start; i < end; i++){
        animation.push({
            type: 'index',
            index: i
        })
        if(array[i] < pivot){
            animation.push({
                type: 'swap',
                swap: [i, next, false]
            })
            // swap array[i] with array[next]
            let tmp = array[next];
            array[next] = array[i];
            array[i] = tmp;
            // increment next
            next++;
        }
    }

    // swap array[next] with pivot (array[end])
    array[end] = array[next];
    array[next] = pivot;
    animation.push({
        type: 'swap',
        swap: [next, end, true]
    })

    return next;
}