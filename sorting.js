let a = [20,10,4,200,40,5]

function bubbleSort(a){
    for(let i = 0;i<a.length-1;i++){
        for(let j=0;j<a.length - i - 1; j++){
            if(a[j] > a[j+1]){
                [a[j],a[j+1]] = [a[j+1],a[j]]
            }
        }
    }
}

function selectionSort(a){
    for(let i = 0;i<a.length;i++){
        let min = i
        for(let j=i;j<a.length;j++){
            if(a[min]>a[j]){
                min = j
            }
        }
        [a[i], a[min]] = [a[min], a[i]];
    }
}

function insertionSort(a){
    for(let i=1; i<a.length ; i++){
        let j = i-1
        let key = a[i]
        while(j>=0 && key<a[j]){
            a[j+1]=a[j]
            j--
        }
        a[j+1] = key
    }
}
function insertionSort2(a){
    for(let i=1; i<a.length ; i++){
        let key = a[i]
        let j
        for(j = i-1;j>=0;j--){
            if(key < a[j]){
                a[j+1]=a[j]
            }
            else{
                break  
            }
        }
        a[j+1]=key

    }
}

 
insertionSort2(a)
console.log(a)



