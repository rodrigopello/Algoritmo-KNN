function Point(x,y,clase){
    this.X = x;
    this.Y = y;
    this.Clase = clase;
}

function Cargarx(x0,x1){
    this.X0 = x0;
    this.X1 = x1;
}

function Cargary(y0,y1){
    this.Y0 = y0;
    this.Y1 = y1;
}

function CargarPunto(x,y,i,j,clase){
    this.X=x;
    this.Y=y;
    this.I=i;
    this.J=j
    this.Clase=clase
}

function Pintar(x0,x1,y0,y1,color){
    this.X0 = x0;
    this.X1 = x1;
    this.Y0 = y0;
    this.Y1 = y1;
    this.Color = color;
}

function Zona(j,i,clase){
    this.J=j;
    this.I=i;
    this.Clase=clase
}

function ZonaColor(j,i,color){
    this.J=j;
    this.I=i;
    this.Color=color
}

function Clase(clase, color){
this.Clase = clase;
this.Color = color;

}
