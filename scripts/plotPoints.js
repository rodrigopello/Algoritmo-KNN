function plotPoints(Test,Training,k) {

    console.log(Test)
    //Defino variables a utilizar
    var ArrayGrid=[]
    var minx =100000;
    var maxx =-100000;
    var miny =100000;
    var maxy =-100000;
    var ArrayPintado =[];
    
// Se definen todas las clases del DATASET
var Colores=["#ff6660","#00c4cc","#f2af11","#711fff","#6c32fc","#646bce"]
var ColoresTes=["#820500","#0b484a","#674e14","#320480","#1f0267","#0e113e"]




//---------------------------------------------------------------------------
var Dataset=Training
var DataTest=Test
    var DatasetTotal=[]
    var longDataTraining=Dataset.length
    Dataset.forEach(element=>{
        DatasetTotal.push(element)
    })
    var longDatatest=DataTest.length
    DataTest.forEach(element=>{//a los elementos del dataset de prueba, se les cambia el nombre de la clase, sumàndole "Test"
        testString=element.Clase
        DatasetTotal.push(element)
    })
 

    var indexColor= 0;
    var C = [] // Defino un arreglo vacío
    var C2 = []
    var control=false // Defino una bandera para controlar las clases en C
    for (let i=1;i <Training.length - 1;i++){
        if (C.length > 0){
            control=false
            for (let j=0; j< C.length;j++){
                if (Training[i].Clase === C[j].Clase){
                    control=true
                }
            }
            if (!control){
                C.push(new Clase(Training[i].Clase,Colores[indexColor]))
                indexColor=indexColor+1;
            }
        }
        else{
            C.push(new Clase(Training[i].Clase,Colores[indexColor]))
            indexColor=indexColor+1;
        }
    }
    indexColor=0
    var C1 = [] // Defino un arreglo vacío
    var control1=false // Defino una bandera para controlar las clases en C
    for (let i=1;i <DataTest.length - 1;i++){
        if (C1.length > 0){
            control1=false
            for (let j=0; j< C1.length;j++){
                if (DataTest[i].Clase === C2[j].Clase){
                    control1=true
                }
            }
            if (!control1){  
                for(let m=0;m <C.length;m++){
                    if(C[m].Clase=== Test[i].Clase){
                        var dato= Test[i].Clase + ' Test'
                    C1.push(new Clase(dato,ColoresTes[m]))
                    C2.push(new Clase(Test[i].Clase,ColoresTes[m]))
                    }
                }
               
            }
        }
        else{
            for(let m=0;m <C.length;m++){
                if(C[m].Clase=== DataTest[i].Clase){
                   var dato= Test[i].Clase + ' Test'
                C1.push(new Clase(dato,ColoresTes[m]))
                C2.push(new Clase(Test[i].Clase,ColoresTes[m]))
                }
            }
        }
    }
    console.log(Training)
    console.log(Test)
    console.log(DataTest)
    console.log(Dataset)
    console.log(C)
    console.log(C1)
    console.log(C2)
    
 /*   var C1 = [] // Defino un arreglo vacío
    var control1=false // Defino una bandera para controlar las clases en C
    for (let i=1;i < DataTest.length - 1;i++){
        if (C1.length > 0){
            control1=false
            for (let j=0; j< C1.length;j++){
                if (DataTest[i].Clase == C1[j].Clase){
                    control1=true
                }
            }
            if (!control1){
                for(let h=0; h<C.length; h++){
                    if(C[h].Clase===Test[i].Clase){
                        C1.push(new Clase(DataTest[i].Clase,ColoresTes[h]))
                    }
                }
            }
        }
        else{
            for(let h=0; h<C.length; h++){
                if(C[h].clase===Test[i].clase){
                    C1.push(new Clase(DataTest[i].Clase,ColoresTes[h]))
                }
            }   
        }
    }

*/
// Cargo todas las clases en el arreglo

var ClasesTotal=[]//queda con todas las clases (test y training)
C.forEach(element=>{

    ClasesTotal.push( new Clase(element.Clase,element.Color))
})
var Clases1=[]//queda con clases de test
C1.forEach(element=>{

    ClasesTotal.push(new Clase(element.Clase,element.Color))
})
console.log(ClasesTotal)


//Busco los menores y los maximos valores del Dataset  tanto en x como en y  

    DatasetTotal.forEach(element=>{
        if(element.X < minx){
           minx=element.X
        }
        if(element.X>maxx){
            maxx=element.X
        }
        if(element.Y<miny){
            miny=element.Y
         }
         if(element.Y>maxy){
             maxy=element.Y
         }
    })
    minx=minx - 0.5
    maxx=maxx + 0.5
    miny=miny - 0.5
    maxy=maxy + 0.5
    var totalx=Math.abs(minx) + Math.abs(maxx)
    var totaly=Math.abs(miny) + Math.abs(maxy)
    var intervalo;
    if (totalx >totaly){
        intervalo=totalx * 0.02
        datocontrol=0
    }
    else{
        intervalo=totaly * 0.02
        datocontrol=1
    }
    var divx=Math.ceil(totalx / intervalo);
    var divy=Math.ceil(totaly / intervalo);

    var infx=minx
    var infy =miny
    var supx=minx + intervalo;
    var supy=miny + intervalo;
  
   var colorselect=""
   
  //Cargar ArrayGrid

  for (let i=0;i < divx;i++){
     supy=miny + intervalo;
     infy=miny
      for (let j=0;j < divy;j++){
           ArrayGrid.push(new CargarPunto(supx,supy,i,j,colorselect))
           ArrayPintado.push(new Pintar(parseFloat(infx),parseFloat(supx),parseFloat(infy), parseFloat(supy), 'white')) 
           infy=supy
           supy=supy + intervalo
      }
      infx=supx
      supx=supx+intervalo
  }
 
  var index=0   
  var data=[]
  var clasesGrid =[]
  C.forEach(element=>{clasesGrid.push(element.Clase)})

  kNNGrid(ArrayGrid,D,ArrayPintado,k,clasesGrid,Colores)
 var testband=0
ClasesTotal.forEach(element=>{ //recorre clases de training
    if (testband <(ClasesTotal.length/2)){
    var clase1 = {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: 'Class: ' + element.Clase,
        marker: {
            size: 8,
            color: element.Color
        }
    };
    data.push(clase1)
}
else{
    var clase2 = {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: 'Class: ' + element.Clase,
        marker: {
            size: 6,
            color: element.Color
        }
    };
    data.push(clase2)
}
    
    
    testband=testband+1
})
console.log(data)
console.log(DatasetTotal)
var long=0

    DatasetTotal.forEach(point => {
        if (long <(longDataTraining)){
        for(let i=0;i < (ClasesTotal.length)/2;i++){
            if (point.Clase === ClasesTotal[i].Clase) {
                data[i].x.push(point.X)
                data[i].y.push(point.Y)
            }
        }
    }
        else {  
        for(let i=(ClasesTotal.length)/2;i < ClasesTotal.length;i++){    
        if ((point.Clase + ' Test') === ClasesTotal[i].Clase) {
            data[i].x.push(point.X)
            data[i].y.push(point.Y)
        }
    }
    }
    long=long+1
});
var options = {
    scrollZoom: true,
    displayModeBar: true,
};
var layout = {title:"Distribucion de Puntos",
  shapes: []
}

for (var i = 0; i < (ArrayPintado.length); i +=1) {
    layout.shapes.push({
        type: 'rect',
        x0: ArrayPintado[i].X0,
        x1: ArrayPintado[i].X1,
        y0: ArrayPintado[i].Y0,
        y1:ArrayPintado[i].Y1,
        fillcolor: ArrayPintado[i].Color,
        layer: 'below',
        opacity: 0.2,
        line: {
            width: 0.1
        }
    })

}






Plotly.newPlot('chart', data, layout, options);

var update = {
    "title": '',    
};


Plotly.relayout('chart', update); 
}


function kNNGrid(ArrayGrid,Dataset,Pintado,k,Clases,Colores) {
            ArrayGrid.forEach(element=>{
            var arrayDistance = calcularDistanciaGrid(element,Dataset);
            var claseWin = seleccionarClaseGrid(arrayDistance,k);
            var index=0
            for(let i=0;i < Clases.length;i++){
                if(Clases[i] === claseWin){
                    element.Clase=Colores[i]
                }
                index = index +1
            }
           
        });
        for (let i=0;i<ArrayGrid.length;i++){
            Pintado[i].Color=ArrayGrid[i].Clase
        }
}


function calcularDistanciaGrid(element,DatasetTraining) { //calcula la distancia del elemento i con los elementos del Training
    var arrayDistance = []; 

    for (let i = 0; i < DatasetTraining.length; i++) {
        var PuntoTraining = DatasetTraining[i];
        var PuntoelementX=parseFloat(element.X)
        var PuntoelementY=parseFloat(element.Y)
         var distancia = Math.sqrt(Math.pow((PuntoTraining.X-PuntoelementX),2)+Math.pow((PuntoTraining.Y-PuntoelementY),2));
        var array1 =[distancia,PuntoTraining.Clase]; //[distancia,clase]
        arrayDistance.push(array1);
    }
    
    arrayDistance=arrayDistance.sort( function(a, b) { //ordena de menor a mayor
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    });
    return arrayDistance;   
}

function seleccionarClaseGrid(arrayDistance,k) {
    var arrayC = new Array(cantClases); //arreglo que acumula la cantidad de clases segun k 
    for (let j = 1; j < (cantClases+1); j++) { //acumula la cantidad de clases encontradas segun k
        array2 = new Array(2); //[cant,Clase]
        array2[1]='C'+j;
        array2[0]=0;

        for (let i = 0; i < k; i++) {
            const element = arrayDistance[i];
            if (element[1]=='C'+j) {
                array2[0]++; 
            }   
           arrayC[j-1]=array2;
        }
                
    }
    arrayC=arrayC.sort( function(a, b) { //ordena de mayor a menor las cantidades
        if (a[0] < b[0]) return 1;
        if (a[0] > b[0]) return -1;
        return 0;
    });

    var mayor = arrayC[0]; //tomo el mayor y compara si hay otras clases con la misma cantidad
    var tot=arrayC.length;
    for (let i = 1; i < tot; i++) {//recorro arrayC
        const element = arrayC[i];        
        if (mayor[0]>element[0]) {
            arrayC.splice(i,1);
        } 
    };

    if (arrayC.length==1) { //caso que una sola clase es la mayor
        var claseWin = arrayC[0][1];  
    } else { //caso varias clases tienen la misma cantidad
        var ranuras=ruleta2Grid(arrayC);//array de ranuras para tirar la ruleta
        var j =Math.trunc(Math.random()*(ranuras.length-1));//seleciona la clase ganadora por ruleta
        var claseWin = ranuras[j];
    };

    return claseWin;

}

function ruleta2Grid(arrayC) {
    var ranuras=[];
    var n=0;
    arrayC.forEach(element=>n+=element[0]);
    for (let i = 0; i < cantClases; i++) { 
        var cant = Math.round((arrayC[i][0]/n)*100);
        var clase=arrayC[i][1]        
        for (let j = 0; j < cant; j++) {
            ranuras.push(clase);            
        }        
    } 
    return ranuras
}

