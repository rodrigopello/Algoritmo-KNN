var D=[];//variable global dataset
var cantClases =0; //almacena la cantidad de clases
var DatasetTest =[];
var DatasetTraining=[];
var porcentaje = 0; //porcentaje de elementos a eliminar
var kOpt=0;
var arregloTest=[];
var arregloPrecision=[];

function cantiClases(D) {
    var C = [] // Defino un arreglo vacío
    var control=false // Defino una bandera para controlar las clases en C
    for (let i=1;i < D.length - 1;i++){
        if (C.length > 0){
            control=false
            for (let j=0; j< C.length;j++){
                if (D[i].Clase == C[j] || D[i].Clase == j){
                    control=true
                }
            }
            if (!control){
                C.push(D[i].Clase)
            }
        }
        else{
            C.push(D[i].Clase)
        }
    }
    cantClases=C.length;
    return cantClases;
}



function tratarData(Dataset,k,porc,tipo) {
    var DTest=[]
    var DTraining=[]

    if (tipo=='GRAFICA') {
        DTest=DatasetTest
        DTraining=DatasetTraining
        plotPoints(DTest,DTraining,k);
        document.querySelector("#cargando").classList.add("d-none");  
    } else {         
        Dataset.shift();//remueve la cabecera del dataset
        D=Dataset;
        porcentaje=porc;
        var n =Dataset.length; //cantidad de registros
        cantClases=cantiClases(Dataset);
        var arrayClases=new Array(cantClases); //crea un array de arrays segun clases existan [[registros C1].....[registros Cn]]
        if (Dataset[0].Clase=='0'||Dataset[0].Clase=='1'||Dataset[0].Clase=='2') {//Reordena el dataset para que sea igual a C1/C2
            changeClass(Dataset);
        } 
        for (let i = 1; i < (cantClases+1); i++) {
            arrayClases[i-1]=Dataset.filter(element => element.Clase=='C'+i);
        }
        var DeleteTotal = Math.round(n*(porcentaje/100)); //calcula la cantidad de elementos que va a eliminar
        var DeleteXClase = Math.trunc(DeleteTotal/cantClases); //calcula la cantidad de elementos a eliminar de cada clase
        var sobrante = DeleteTotal-(cantClases*DeleteXClase);//sobrante de la division, caso no sea exacta
        //-----------------tratar caso la division no sea exacta
        var del1=0;
        var del2=0;
        var del3=0;
        if (sobrante>0) { 
            var ranuras=ruleta(arrayClases,n);//array de ranuras de clases  
            
            for (let i = 0; i < sobrante; i++) {
                var j =Math.trunc(Math.random()*99);
                var claseToDelete = ranuras[j];  
                
                for (let z = 0; z < cantClases; z++) {
                    const element = arrayClases[z][0];
                    if (element.Clase==claseToDelete) {
                        var h = Math.trunc(Math.random()*(arrayClases[z].length-1));//posicion del elemento a eliminar calculada al azar
                        DatasetTest.push(arrayClases[z][h]); //almacenamos el elemento eliminado en trainig
                        arrayClases[z].splice(h,1);  //se elemina el elemento
                        switch (claseToDelete) {
                            case 'C1':
                                del1++;
                            break;
                            case 'C2':
                                del2++;
                            break;
                            case 'C3':
                                del3++;
                            break;                            
                        }
                    }
                    
                }
            }
        } 
        //-------------se eliminan registros que se cargaran en el dataset Prueba------------------
        for (let i = 0; i < arrayClases.length; i++) { //recorre el array clases para eliminar los elementos
            for (let z = DeleteXClase; z > 0; z--) { //elimina la cantidad de elementos indicado por DeleteClase
                var j = Math.trunc(Math.random()*(arrayClases[i].length-1));//posicion del elemento a eliminar calculada al azar
                DatasetTest.push(arrayClases[i][j]); //almacenamos el elemento eliminado en trainig
                arrayClases[i].splice(j,1);  //se elemina el elemento
            }   
        }
        //--------se carga el array entrenamiento con el resto del contenido de array clases---------------------
        var ent1=arrayClases[0].length;
        var ent2=arrayClases[1].length;
        arrayClases.forEach(element=>element.forEach(element2=> DatasetTraining.push(element2)));
        //-------------llamadas a funciones-------------------------
        DTest=DatasetTest
        DTraining=DatasetTraining        
        arregloPrecision = kNN(DatasetTest,DatasetTraining);
        //var arregloKOptimo = kOptimo(DatasetTest,DatasetTraining);
        //console.log(arregloKOptimo);   
        console.log(arregloPrecision);  
        var mayorK=mayor(arregloPrecision);
        plotPoints(DTest,DTraining,mayorK[0]);
        document.querySelector("#cargando").classList.add("d-none");   
        document.getElementById("kOptimo").value = mayorK[0];
        document.getElementById("PorcOptimo").value = (mayorK[1]*100).toFixed(2);
        document.getElementById("PorcEntre").value = 100-porcentaje;
        document.getElementById("PorcC1").value = ((ent1/(ent1+ent2))*100).toFixed(2);
        document.getElementById("PorcC2").value = ((ent2/(ent1+ent2))*100).toFixed(2);
        document.getElementById("PorcPrueba").value = porcentaje;
        document.getElementById("PorcC11").value = (((DeleteXClase+del1)/DeleteTotal)*100).toFixed(2);
        document.getElementById("PorcC22").value = (((DeleteXClase+del2)/DeleteTotal)*100).toFixed(2);
    }
}

function kNN(DatasetTest,DatasetTraining) {    
    arrayPrecisiones=[];
    var n=DatasetTraining.length;
    for (let k = 1; k < (n+1); k++){
        var arrayPrueba=[];
        arrayPrueba.push(k);
        var precision=0;
        DatasetTest.forEach(element=>{
            var arrayDistance = calcularDistancia(element,DatasetTraining);
            var claseWin = seleccionarClase(arrayDistance,k);
            var X=element.X;
            var Y=element.Y;
            var C=element.Clase;
            var a=[X,Y,C,claseWin]
            arrayPrueba.push(a);
            if (claseWin==element.Clase) {
                precision++;
            } 
        });
        
        arregloTest.push(arrayPrueba);
        
        precision=precision/DatasetTest.length;
        if (isNaN(precision)) {
            precision=1
        }
        var aux = [k,precision];
        arrayPrecisiones.push(aux);
    }    
    //console.log(arregloTest);
    generatekPrecisionTable(arrayPrecisiones);
    generateRankingTable(arrayPrecisiones);
    return arrayPrecisiones;
}

function calcularDistancia(element,DatasetTraining) { //calcula la distancia del elemento i con los elementos del Training
    var arrayDistance = []; 

    for (let i = 0; i < DatasetTraining.length; i++) {
        var PuntoTraining = DatasetTraining[i];
        var distancia = Math.sqrt(Math.pow((PuntoTraining.X-element.X),2)+Math.pow((PuntoTraining.Y-element.Y),2));
        var array1 =[distancia,PuntoTraining.Clase,PuntoTraining.X,PuntoTraining.Y]; //[distancia,clase]
        arrayDistance.push(array1);
    }
    
    arrayDistance=arrayDistance.sort( function(a, b) { //ordena de menor a mayor
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    });
    return arrayDistance;   
}

function agregarElementos(){ 
    var lista=document.getElementById("ulListado"); 
    Dato.forEach(function(data,index){
    var linew= document.createElement("li");    
    var contenido = document.createTextNode(data);
    lista.appendChild(linew);
    linew.appendChild(contenido);
    
    })
}
function ruleta(arrayClases,n) {
    var ranuras=[];
    for (let i = 1; i < (cantClases+1); i++) { //arma un arreglo de 0 a 99 con las ranuras de clases
        var cant = Math.round((arrayClases[i-1].length/n)*100);
        var clase=arrayClases[i-1][0].Clase

        for (let j = 0; j < cant; j++) {
            ranuras.push(clase);            
        }        
    } 
    return ranuras
}

function seleccionarClase(arrayDistance,k) {
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
           //console.log(arrayC[j-1]);
        }                
    }
    
    arrayC=arrayC.sort( function(a, b) { //ordena de mayor a menor las cantidades
        if (a[0] < b[0]) return 1;
        if (a[0] > b[0]) return -1;
        return 0;
    });
    
    var arrayC2=[];
    var mayor = arrayC[0]; //tomo el mayor y compara si hay otras clases con la misma cantidad
    arrayC2.push(mayor);
    var tot=arrayC.length;
    for (let i = 1; i < tot; i++) {//recorro arrayC
        const element = arrayC[i];
        if (mayor[0]==element[0]) {
            //arrayC.splice(i,1);
            arrayC2.push(element);
        } 
    };

    if (arrayC2.length==1) { //caso que una sola clase es la mayor
        var claseWin = arrayC[0][1];  
    } else {  //caso varias clases tienen la misma cantidad
        var ranuras=ruleta2(arrayC2);//array de ranuras para tirar la ruleta
        var j =Math.trunc(Math.random()*(ranuras.length-1));//seleciona la clase ganadora por ruleta
        var claseWin = ranuras[j];
    };
    return claseWin;
}

function ruleta2(arrayC) {
    var ranuras=[];
    var n=0;
    arrayC.forEach(element=>n+=element[0]);
    for (let i = 0; i < arrayC.length; i++) { 
        var cant = Math.round((arrayC[i][0]/n)*100);
        var clase=arrayC[i][1]        
        for (let j = 0; j < cant; j++) {
            ranuras.push(clase);            
        }        
    } 
    return ranuras
}

function PointClassifier(point,k,Dataset) { //Clasificador de un punto especifico
    var arrayDistance = calcularDistancia(point,Dataset);
    //console.log(arrayDistance);
    var claseWin = seleccionarClase(arrayDistance,k);
    return claseWin;
}

function mayor(array) {   
    array=array.sort(function(a, b) { //ordena de mayor a menor las cantidades
        if (a[1] < b[1]) return 1;
        if (a[1] > b[1]) return -1;
        return 0;
    });
    return array[0];
}
//-------------------generaciòn de tablas de datos----------------------------------------------

function generateClasesTable(k){

    var elmtTable = document.getElementById('classTable');
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    for (var x=rowCount-1; x>0; x--) {
        elmtTable.removeChild(tableRows[x]);
    }
    

    document.getElementById("classTable").style.display="block";
    var array = arregloTest[k-1];

    var arrayLength = array.length;
    var theTable = document.getElementById('classTable').getElementsByTagName('tbody')[0];

    for (var i = 1, tr, td; i < arrayLength; i++) {
        

        tr = document.createElement('tr');

        td = document.createElement('td');
        td.appendChild(document.createTextNode(i+1));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(array[i][0]));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(array[i][1]));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(array[i][2]));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(array[i][3]));
        tr.appendChild(td);

        theTable.appendChild(tr);
    }
    var prec=0;
    arrayPrecisiones.forEach(element=>{if (element[0]==k){prec=element[1]*100}});
    document.getElementById("Porcientos").value = prec;
}

function generateRankingTable(arreglo){
    var array=sortByCol(arreglo, 1);
    var arrayLength = array.length;
    var theTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];

    for (var i = 0, tr, td; i < arrayLength; i++) {
        tr = document.createElement('tr');

        td = document.createElement('td');
        td.appendChild(document.createTextNode(i+1));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(array[i][0]));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(((array[i][1]*100).toFixed(2))+"%"));
        tr.appendChild(td);
        theTable.appendChild(tr);
    }
    
}
function generatekPrecisionTable(arreglo){
    var arreglo2=[];
    for (let i = 1; i < 11; i++) {
        arreglo.forEach(element => {if (element[0]==i) {arreglo2.push(element);}});        
    }
    var array=sortByCol(arreglo2, 1);    
    var arrayLength = array.length;
    var theTable = document.getElementById('kPrecisionTable').getElementsByTagName('tbody')[0];

    for (var i = 0, tr, td; i < arrayLength; i++) {

        tr = document.createElement('tr');
        
        td = document.createElement('td');
        td.appendChild(document.createTextNode(i+1));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(array[i][0]));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(((array[i][1]*100).toFixed(2))+"%"));
        tr.appendChild(td);
        theTable.appendChild(tr);
    }
    
}
    
function sortByCol(arr, colIndex){
    arr.sort(sortFunction)
    function sortFunction(a, b) {
        a = a[colIndex]
        b = b[colIndex]
        return (a === b) ? 0 : (a > b) ? -1 : 1
    }
    return arr;
}

    
function changeClass(Dataset) {
    Dataset.forEach(element=>{
        var c =parseInt(element.Clase)+1;
        element.Clase='C'+c});
}