"use client";
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import saveNames from '../app/api/saveNames';
import getCurrentNames from '../app/api/getCurrentNames';

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const currentMonth = getCurrentMonth();
  const daysMatrix = [
    0,1,2,
    7,8,9,
    14,15,16,
    21,22,23
  ];
  const calendarDays = getDays();
  const position = ["CCU", "Porta1", "Porta2", "Porta3"]

  const getScheduleNames = () => {
    const currentScheduleNames = getCurrentNames(currentMonth)

    return [
      {
        names: [['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
      },
      {
        names: [['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
      },
      {
        names: [['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
      },
      {
        names: [['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
      },
      {
        names: [['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
      },
    ];
  }
  const initialRows = getScheduleNames();


  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  }));

  const [calendarData, setCalendarData] = useState(initialRows);

  const handleNameChange = (dayIndex: number, nameIndex: number, personIndex: number, newName: string, position: string) => {
    const updatedData = [...calendarData];
    updatedData[dayIndex].names[nameIndex][personIndex] = newName;
    setCalendarData(updatedData);
    saveNames(position, newName)
  };

  function getCurrentMonth(): string | undefined {
    const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const d = new Date();
    return month[d.getMonth()];
  }

  function getFirstTuesdayOfMonth(year: number, month: number) {
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;
    const firstTuesdayOfMonth = new Date(year, month, 1 + daysUntilTuesday);
    return firstTuesdayOfMonth.getDate();
  }
  
  function getDays(): number[]{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstTuesday = getFirstTuesdayOfMonth(currentYear, currentMonth);
    return daysMatrix.map((day) => day+firstTuesday)
  }

  function getDayOfMonth(nameIndex: number, dayIndex: number) {
    return calendarDays[nameIndex]+(dayIndex*7)
  }

  function getFieldName(nameIndex: number, dayIndex: number, personIndex: number): string{
    return getDayOfMonth(nameIndex, dayIndex).toString()+"/"+getCurrentMonth()+"/"+position[personIndex]
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ height: '100%', backgroundColor: '#CFFFF7' }}>
        <TableHead sx={{ backgroundColor: purple[500], filter: 'drop-shadow(8px 8px 10px #9c27b0)', width: '100%' }}>
          <TableRow>
            <TableCell align='center' sx={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>{currentMonth}</TableCell>
            <TableCell align='center' sx={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>Terça</TableCell>
            <TableCell align='center' sx={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>Quarta</TableCell> 
            <TableCell align='center' sx={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>Quinta</TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {calendarData.map((row, dayIndex) => (
            <TableRow key={dayIndex} sx={{ align: 'center' }}>
              <TableCell sx={{ width: '15%', textAlign: 'center', border: '0px', color: '#950076' }}>
                <br></br>
                <ColorButton variant="contained" sx={{ width: '60%' }}>CCU</ColorButton>
                <ColorButton variant="contained" sx={{ width: '60%' }}>Porta</ColorButton>
                <ColorButton variant="contained" sx={{ width: '60%' }}>Porta</ColorButton>
                <ColorButton variant="contained" sx={{ width: '60%' }}>Porta</ColorButton>
              </TableCell>
              {row.names.map((name, nameIndex) => (
                <TableCell key={nameIndex} align='center'>
                  <b>{"Dia "+getDayOfMonth(nameIndex, dayIndex)}</b><br></br>
                  {name.map((person, personIndex) => (
                    <TextField
                      color="secondary" focused
                      onChange={(e) => handleNameChange(dayIndex, nameIndex, personIndex, e.target.value, e.target.name)}
                      sx={{ width: '70%', backgroundColor: '#FFFFFF', borderRadius: '10px', }}
                      size="small"
                      name={getFieldName(nameIndex, dayIndex, personIndex)}
                    />
                  ))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Calendar;
