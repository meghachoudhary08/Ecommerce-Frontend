var number = 10;
console.log(fibonacciSeries(number));

function fibonacciSeries(number){
    var fibonacci = [0,1];

    for(var i = 2; i<number; i++){
        fibonacci[i] = fibonacci[i-1] + fibonacci [i-2];
    
    }
    return fibonacci;
}