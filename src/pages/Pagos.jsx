import React from "react";
import {Card, CardBody} from "@nextui-org/react";
import {Checkbox} from "@nextui-org/react";
import {Image} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow,TableCell} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
export default function Pagos(){
    return(
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '90%', padding: '10px', marginTop: '20px' }}>
                    <CardBody>
                        <p style={{ textAlign: 'center',fontSize: '30px' }}>Seleccione un metodo de pago</p>
                    </CardBody>                
                </Card>
            </div>  
            <div style={{ display: 'flex', justifyContent: 'center',marginTop: '20px' }}>
                <Checkbox  size="sm">Boleta simple</Checkbox>
                <Checkbox  size="sm">Factura</Checkbox>                
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Image
                    width={600}
                    height={600}
                    alt="Prueba"                    
                    src="https://www.miraflores.gob.pe/wp-content/uploads/2020/06/0B70F534-3264-4244-9553-931C7CD82367-1024x498.jpeg"
                />
                <Card style={{marginLeft: '20px'}}>
                    <CardBody>
                        <p>Datos de la empresa:</p>   
                    </CardBody>
                </Card>
                <Card style={{marginLeft: '20px'}}>
                    <CardBody>
                        <p>Datos de la boleta</p>                    
                    </CardBody>
                </Card>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', }}>
                <Card style={{ width: '80%', padding: '10px', marginTop: '20px' }}>
                    <CardBody >
                        <p>Fecha emision:</p>

                    </CardBody>
                </Card>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <Table aria-label="Example static collection table"  >
                    <TableHeader>
                        <TableColumn>Cant.</TableColumn>
                        <TableColumn>Descripcion</TableColumn>
                        <TableColumn>Precio</TableColumn>
                        <TableColumn>Total</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1">
                        <TableCell>1</TableCell>
                        <TableCell>CEO</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Active</TableCell>
                        </TableRow>

                        <TableRow key="2">
                            <TableCell>2</TableCell>
                            <TableCell>CEO</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Active</TableCell>
                        </TableRow>

                        <TableRow key="3">
                            <TableCell>3</TableCell>
                            <TableCell>CEO</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Active</TableCell>
                        </TableRow>

                        <TableRow key="4">
                            <TableCell>4</TableCell>
                            <TableCell>CEO</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Active</TableCell>                            
                        </TableRow>                        
                    </TableBody>
                </Table>
            </div>
            <div style={{marginTop:'20px', display: 'flex',flexDirection: 'column', alignItems: 'flex-end'      }}>
                <div style={{ width: '150px', marginTop: '10px'}}>                    
                    <Input type="number"  label="Total Bruto"  />
                </div>
                <div style={{ width: '150px', marginTop: '10px' }}>                    
                    <Input type="number" label="IGV" />
                </div>
                <div style={{ width: '150px',  marginTop: '10px'}}>                    
                    <Input type="number" label="Total a pagar"/>
                </div>                
            </div>
        </div>                    
    );
}