grammar greenCode;

//ya
start : funcion* parcela EOF;
//ya
parcela : PARCELA ID_PARCELA bloque COSECHA;

// Función: injerto
funcion : INJERTO ID_PARCELA PAR_IZQ parametros? PAR_DER PRODUCE tipoDato bloque;

// Lista de parámetros separados por coma
parametros : parametro (COMA parametro)*;
parametro : ID_VARIABLE TIPO tipoDato;

//ya
// Todo bloque lleva corchetes, aunque tenga una sola instrucción.
bloque : COR_IZQ sentencia* COR_DER;

//ya
// Sentencias. Las simples terminan en ';'. Las estructuras de control terminan en ']' y NO llevan ';'
sentencia : declaracion | asignacion | salida | entrada | retorno | monitorear | regar | madurar;

//ya
// brotar #nombre tipo <tipo> [: <expresión>];
declaracion : BROTAR ID_VARIABLE TIPO tipoDato (ASIGNAR expresion)? PUNTO_COMA;

//ya
// nutrir #nombre: <expresión>;
asignacion : NUTRIR ID_VARIABLE ASIGNAR expresion PUNTO_COMA;

//ya
// emitir <expresión>;   (salida)
salida : EMITIR expresion PUNTO_COMA;

//ya
// captar #variable;     (entrada; la variable ya debe estar declarada)
entrada : CAPTAR ID_VARIABLE PUNTO_COMA;

//ya
// fruto <expresión>;    (retorno de una función)
retorno : FRUTO expresion PUNTO_COMA;


//ya
// Decisión de tres caminos.
//   florece  -> obligatorio
//   marchita -> opcional, puede repetirse
//   reposo   -> opcional, siempre al final
monitorear : MONITOREAR PAR_IZQ expresion PAR_DER FLORECE bloque (MARCHITA PAR_IZQ expresion PAR_DER bloque)*(REPOSO bloque)?;

//ya
// Repetición condicional: evalúa antes de entrar y repite mientras sea cierta.
regar : REGAR PAR_IZQ expresion PAR_DER bloque;

//ya
// Repetición por pasos. La variable de control NO se declara con 'brotar'(se declara implícitamente como semilla), 'paso' es opcional (vale 1).
madurar : MADURAR PAR_IZQ ID_VARIABLE DESDE expresion HASTA expresion (PASO expresion)? PAR_DER bloque;

//ya
tipoDato : TIPO_CLIMA | TIPO_ACTUADOR | TIPO_SEMILLA | TIPO_CONTEXTO;

//ya
expresion
    : LIT_CLIMA                                                          
    | LIT_SEMILLA                                                        
    | LIT_ACTUADOR                                                       
    | LIT_CONTEXTO                                                       
    | ID_VARIABLE                                                        
    | llamada                                                           
    | PAR_IZQ expresion PAR_DER                                         
    | RESTA expresion                                                    
    | OP_NO expresion                                                    
    | expresion MULT expresion                                           
    | expresion DIV expresion                                            
    | expresion SUMA expresion                                           
    | expresion RESTA expresion                                          
    | expresion OP_SUPERA expresion                                      
    | expresion OP_DEBAJO expresion                                      
    | expresion OP_COINCIDE expresion                                    
    | expresion OP_DIFIERE expresion                                     
    | expresion OP_FUSION expresion                                      
    | expresion OP_RELEVO expresion                                     
    ;

//ya
llamada : ID_PARCELA PAR_IZQ argumentos? PAR_DER;

argumentos : expresion (COMA expresion)*;


//Estructura y programa
PARCELA     : 'parcela' ;
COSECHA     : 'cosecha' ;
INJERTO     : 'injerto' ;
PRODUCE     : 'produce' ;
FRUTO       : 'fruto' ;

//Tipos de datos
TIPO_CLIMA     : 'clima' ;
TIPO_ACTUADOR  : 'actuador' ;
TIPO_SEMILLA   : 'semilla' ;
TIPO_CONTEXTO  : 'contexto' ;

//Declaración y asignación
BROTAR      : 'brotar' ;
TIPO        : 'tipo' ;
NUTRIR      : 'nutrir' ;

//Decisión y repetición
MONITOREAR  : 'monitorear' ;
FLORECE     : 'florece' ;
MARCHITA    : 'marchita' ;
REPOSO      : 'reposo' ;
REGAR       : 'regar' ;
MADURAR     : 'madurar' ;
DESDE       : 'desde' ;
HASTA       : 'hasta' ;
PASO        : 'paso' ;

//Entrada / salida
EMITIR      : 'emitir' ;
CAPTAR      : 'captar' ;

//Operadores relacionales y lógicos
OP_SUPERA   : 'supera' ;     // >
OP_DEBAJO   : 'debajo' ;     // <
OP_COINCIDE : 'coincide' ;   // ==
OP_DIFIERE  : 'difiere' ;    // !=
OP_FUSION   : 'fusion' ;     // AND 
OP_RELEVO   : 'relevo' ;     // OR
OP_NO       : 'no' ;         // NOT

//Literales de actuador
LIT_ACTUADOR : 'encendido' | 'apagado' ;

//Operadores aritméticos y delimitadores
SUMA        : '+' ;          
RESTA       : '-' ;          
MULT        : '*' ;
DIV         : '/' ;
ASIGNAR     : ':' ;          
PUNTO_COMA  : ';' ;
COMA        : ',' ;
COR_IZQ     : '[' ;
COR_DER     : ']' ;
PAR_IZQ     : '(' ;
PAR_DER     : ')' ;

//Identificadores
//Ej: #temp_suelo, #Humedad1
ID_VARIABLE : '#' LETRA (LETRA | DIGITO | '_')* ;

//Nombre de parcela o de función
// Ej: control_tomates, calcular_deficit
ID_PARCELA  : [a-z] (LETRA | DIGITO | '_')* ;

//Literales numéricos y de texto
LIT_CLIMA    : DIGITO+ '.' DIGITO+ ;
// semilla: solo dígitos enteros (0, 12).
LIT_SEMILLA  : DIGITO+ ;
//contexto: comillas dobles, sin saltos de línea ni comillas internas
LIT_CONTEXTO : '"' ~["\r\n]* '"' ;

//Comentarios (se descartan)
//Una línea:  >> texto
COMENTARIO_LINEA  : '>>' ~[\r\n]*       -> skip ;
// Varias líneas:  &> texto <& 
COMENTARIO_BLOQUE : '&>' .*? '<&'       -> skip ;

//Espacios en blanco se descartan
ESPACIOS : [ \t\r\n\u000C\uFEFF]+ -> skip ;

//Fragmentos auxiliares (no generan tokens por sí solos)
fragment LETRA  : [a-zA-Z] ;
fragment DIGITO : [0-9] ;
