import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactDOM from 'react-dom';

export default function MonitorTable(props) {
    const [onTotal, setOnTotal] = useState(null);
    const [offTotal, setOffTotal] = useState(null);

    const getTotal = () => {
        if (props.timer >= 1) {
            let totalOn = new Array(props.header.length - 1).fill(0);
            let totalOff = new Array(props.header.length - 1).fill(0);
            props.table.forEach(row => {
                row.forEach((ele, index) => {
                    if (index > 0) {
                        if (ele === "online")
                            totalOn[index - 1]++;
                        if (ele === "offline")
                            totalOff[index - 1]++;
                    }
                })
            })
            setOnTotal([...totalOn]);
            setOffTotal([...totalOff]);
        }
    }

    useEffect(() => {
        getTotal();
    }, [props.timer])

    return (
        <div>

            <div style={{ height: '40vh', overflowY: 'scroll', overflowX: 'scroll' }}>
                {
                    props.header && <Table striped bordered hover varaint="dark" responsive size="sm">
                        <thead>
                            <tr>
                                {props.header.map((val, index) => <th key={index}>{val}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.table.length>0 && props.table.map(row => {
                                    return <tr>{row.map((ele, index) => {
                                        return <td key={index}>{ele}</td>
                                    })
                                    }
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                }
            </div>
            <Table>
                <tbody>
                    <tr>
                        <td>Online</td>
                        {onTotal && onTotal.map((ele, index) => <td key={index} >{ele}</td>)}
                    </tr>
                    <tr>
                        <td>Offline</td>
                        {offTotal && offTotal.map((ele, index) => <td key={index} >{ele}</td>)}
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}