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

export default function Home() {
  const [numOfDevices, setNumOfDevices] = useState(0);
  const [cacheNumOfDevices, setCacheNumOfDevices] = useState(0);
  const [deviceIDs, setDeviceIDs] = useState([]);
  const [header, setHeader] = useState();
  const [table, setTable] = useState([]);
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(false);
  const [limit] = useState(5); //set limit = 150 for 5 minutes
  const [onTotal, setOnTotal] = useState(null);
  const [offTotal, setOffTotal] = useState(null);

  const getData = async () => {
    if (timer == limit) {
      var newDataOn = {...table[0]};
      newDataOn["Timestamp"] = "Online";
      Object.keys(newDataOn).forEach((key, index) => {
        if (index<onTotal.length) {
          newDataOn[key] = onTotal[index];
        }
      })
      var newTable = table;
      newTable.push(newDataOn);
      var newDataOff = {...table[1]};
      newDataOff["Timestamp"] = "Offline"
      Object.keys(newDataOff).forEach((key, index) => {
        if (index<offTotal.length) {
          newDataOff[key] = offTotal[index];
        }
      })
      newTable.push(newDataOff);
      setTimer(0);
      setTable([...newTable]);
    }
    else {
      var totalOn, totalOff;
      totalOn = onTotal ? onTotal : new Array(header.length - 1).fill(0);
      totalOff = offTotal ? offTotal : new Array(header.length - 1).fill(0);
      const devices = { 'devices': deviceIDs };
      const body = JSON.stringify(devices);
      setTimer(timer + 1);
      const newData = await getStatus(body);
      Object.values(newData).forEach((val, index) => {
        if (val === "online") {
          totalOn[index]++;
        }
        else {
          totalOff[index]++;
        }
      })
      var data = { Timestamp: moment(Date.now()).format() };
      var finalData = Object.assign(data, newData);
      var newTable = table;
      newTable.push(finalData);
      setOnTotal([...totalOn]);
      setOffTotal([...totalOff]);
      setTable([...newTable]);
    }
  }

  const csvReport = {
    data: table,
    headers: header,
    filename: 'Device_Monitor.csv'
  };

  useEffect(() => {
    if (start) {
      var interval = setInterval(async () => {
        await getData();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [table])

  return (
    <div className="container" style={{ overflowY: 'hidden' }}>
      <h1>Moniter Devices</h1>
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
      <h2>Devices</h2>
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
        numOfDevices > 0 && <Button className="Primary" onClick={() => { setStart(true); getData() }}>Start</Button>
      }
      {
        start && <Button style={{ marginLeft: '3px' }} className="Primary" onClick={() => setStart(false)}>Stop</Button>
      }
      {
        <MonitorTable limit={limit} header={header} table={table} timer={timer} />
      }
      <CSVLink {...csvReport}>Export to CSV</CSVLink>
    </div>
  )
}
