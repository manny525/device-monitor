import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';

export default function MonitorTable(props) {
    return (
        <div style={{ height: '40vh', overflowY: 'scroll', overflowX: 'scroll' }}>
            {
                props.header && <Table striped bordered hover varaint="dark" responsive size="sm">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            {props.header.map((val, index) => <th key={index}>{val}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.table.length > 0 && props.table.map((row, index) => {
                                let nrow = Object.values(row)
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    {
                                        nrow.map((ele, index) => {
                                            if (index == 0)
                                                return <td key={index}>{nrow[nrow.length - 1]}</td>
                                            else
                                                return <td key={index}>{nrow[index - 1]}</td>
                                        })
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            }
        </div>
    )
}