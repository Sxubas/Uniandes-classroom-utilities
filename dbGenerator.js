const classrooms = require('./results.json')
const fs = require('fs')
const Calendar = require('calendar').Calendar

//Calendar object to manage dates. Weekdays[0] are mondays.
const cal = new Calendar(1);

const queryAndWrite = (day, month, year) => {

  let dayStr = day;
  let monthStr = month;

  if (day < 10) dayStr = '0' + day;
  if (month < 10) monthStr = '0' + month;

  const date = dayStr + '-' + monthStr + '-' + year

  let query = { classrooms: [] }

  for (const classroom of classrooms) {

    if (classroom.schedules[date]) {
      query.classrooms.push({
        name: classroom.name,
        schedules: classroom.schedules[date]
      });
    }
    else {
      console.log(classroom.name + " Classroom does not have this date defined")
    }
  }

  fs.writeFile('./DB/dates/' + date + '.json', JSON.stringify(query, null, 2), err => {
    if (err) console.log(err);
    //else console.log(date, " Successfully logged");
  });
}


const generateDB = () => {

  let monthRange = [];
  const startMonth = 1
  const endMonth = 5

  //Months to query
  for (let i = startMonth; i <= endMonth; i++) {
    monthRange.push(i);
  }

  //Each month
  for (const month of monthRange) {

    let monthWeeks = cal.monthDays(2018, month - 1) //Jan is 0 - Dec is 11

    for (const week of monthWeeks) {

      for (const day of week) {
        //If the day is in the month
        if (day !== 0) {
          //Query and write to the DB
          queryAndWrite(day, month, 18)
        }
      }
    }
  }
}

const mergeToArray = () => {

  let mergedArray = [];

  fs.readdir('DB/dates', (err, fileNames) => {

    if (err) throw err;

    fileNames.forEach(fileName => {
      const date = fileName.split('.')[0]
      let dateData = require('./DB/dates/' + fileName)
      dateData.date = date
      mergedArray.push(dateData)
    });

    fs.writeFile('./DB/DB-file.min.json', JSON.stringify(mergedArray), err => {
      if (err) console.log(err);
    });
    fs.writeFile('./DB/DB-file.json', JSON.stringify(mergedArray, null, 2), err => {
      if (err) console.log(err);
      else console.log("Successfully logged DB file");
    });

  });
}

//Execution


generateDB();
mergeToArray();
