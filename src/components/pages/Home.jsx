import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Input from 'react-bootstrap/InputGroup';
import LoadingPage from './LoadingPage';
import { useDispatch, useSelector } from 'react-redux';
// import { setMyCourses } from '../../store/actions/status';
import getStatus from '../../apiCalls/getStatus';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import MonitorTable from '../MonitorTable';
import { CSVLink } from "react-csv";
import moment from 'moment';

export default function Home(props) {
  const [numOfDevices, setNumOfDevices] = useState(0);
  const [cacheNumOfDevices, setCacheNumOfDevices] = useState(0);
  const [deviceIDs, setDeviceIDs] = useState([]);
  const [header, setHeader] = useState();
  const [table, setTable] = useState([]);
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(false);

  const getData = async () => {
    setStart(true);
    const devices = { 'devices': deviceIDs };
    const body = JSON.stringify(devices);
    setTimer(timer + 1);
    const newData = await getStatus(body);
    const data = { Timestamp: moment(Date.now()).format() };
    const finalData = Object.assign(data, newData);
    console.log(finalData);
    let newTable = table;
    newTable.push(finalData);
    setTable([...newTable]);
  }

  const csvReport = {
    data: table,
    headers: header,
    filename: 'Device_Monitor.csv'
  };

  useEffect(() => {
    if (start) {
      if (timer < 15)
        var interval = setInterval(async () => {
          await getData();
        }, 2000);
      return () => clearInterval(interval);
    }
  }, [table])

  return (
    <div className="container" style={{ overflowY: 'hidden' }}>
      <h1>Moniter Devices</h1>
      <h2>Devices</h2>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">Number of Devices</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Enter a positive Integer"
          aria-label="num_of_devices"
          aria-describedby="basic-addon1"
          onChange={(e) => {
            if (e.target.value) {
              setCacheNumOfDevices(parseInt(e.target.value));
            }
          }}
        />
        <Button className="Primary" onClick={() => setNumOfDevices(cacheNumOfDevices)}>Set</Button>
      </InputGroup>
      {
        Array(numOfDevices).fill(1).map((e, index) =>
          <InputGroup className="mb-3" key={index}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Device ID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Enter ID"
              aria-label="device_id"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                if (e.target.value) {
                  let ids = deviceIDs;
                  ids[index] = e.target.value;
                  setHeader(["Timestamp", ...ids]);
                  setDeviceIDs(ids);
                }
              }}
            />
          </InputGroup>
        )
      }
      {
        numOfDevices > 0 && <Button className="Primary" onClick={() => getData()}>Start</Button>
      }
      {
        <MonitorTable header={header} table={table} timer={timer} />
      }
      <CSVLink {...csvReport}>Export to CSV</CSVLink>
    </div>
  )
}
