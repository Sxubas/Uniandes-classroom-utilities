
const Calendar = require('calendar').Calendar
const courses = require('./data/courses.json')
const courses8A = require('./data/courses8A.json')
const courses8B = require('./data/courses8B.json')
const coursesMED = require('./data/coursesMED.json')

const fs = require('fs')

let classrooms = []

//Calendar object to manage dates. Weekdays[0] are mondays.
const cal = new Calendar(1);

const searchClassroom = testClassroom => {

  for (const classroom of classrooms) {
    if (classroom.name === testClassroom) {
      return classroom;
    }
  }
  return undefined;
}

const extractClassdays = schedule => {
  let classDays = []

  if (schedule.L) classDays.push(0)
  if (schedule.M) classDays.push(1)
  if (schedule.I) classDays.push(2)
  if (schedule.J) classDays.push(3)
  if (schedule.V) classDays.push(4)
  if (schedule.S) classDays.push(5)
  if (schedule.D) classDays.push(6)

  return classDays;
}

const parseMonthStr = monthStr => {
  if (monthStr === "ENE" || monthStr === "JAN") return 1;
  if (monthStr === "FEB") return 2;
  if (monthStr === "MAR") return 3;
  if (monthStr === "APR" || monthStr === "ABR") return 4;
  if (monthStr === "MAY") return 5;
  if (monthStr === "JUN") return 6;
  if (monthStr === "JUL") return 7;
  if (monthStr === "AUG") return 8;
  if (monthStr === "SEP") return 9;
  if (monthStr === "OCT") return 10;
  if (monthStr === "NOV") return 11;
  if (monthStr === "DEC") return 12;
  throw new Error("Invalid month String: " + monthStr + "/ " + monthStr.length)
}

const extractMonthRange = (schedule) => {

  const startData = schedule.date_ini.split('-')
  const endData = schedule.date_fin.split('-')
  const startMonth = parseMonthStr(startData[1])
  const endMonth = parseMonthStr(endData[1])

  let range = [];

  for (let i = startMonth; i <= endMonth; i++) {
    range.push(i);
  }

  return range;
}

const buildDateString = (day, month, year) => {
  let dayStr, monStr, yearStr;

  dayStr = day; monStr = month;

  if (day < 10) dayStr = "0" + day;
  if (month < 10) monStr = "0" + month;

  return `${dayStr}-${monStr}-${year}`
}

const extractDate = dateString => {
  let date = ['', '', '']
  const data = dateString.split('-')

  date[0] = parseInt(data[0])
  date[2] = parseInt(data[2])

  date[1] = parseMonthStr(data[1])

  return date
}

const extractClassrooms = (courseList) => {

  for (const course of courseList.records) {

    for (const schedule of course.schedules) {

      let classroom = searchClassroom(schedule.classroom)

      //If the classroom does not exits, add it to the list
      if (!classroom) {
        classroom = {
          name: schedule.classroom,
          schedules: {
            /*
            "16-08-18" : [ '0900 - 1050', ... ],
            "13-10-18" : [...],
            ...
            */
          }
        };
        classrooms.push(classroom)
      }

      const classDays = extractClassdays(schedule)

      //Should be an array of integers, each i: 1 <= i <= 12
      const monthRange = extractMonthRange(schedule)

      //[day, month, year]
      //[16, 8, 18]
      const startDate = extractDate(schedule.date_ini)
      const endDate = extractDate(schedule.date_fin)

      for (const month of monthRange) {

        let monthDays = cal.monthDays(2018, month - 1) //Jan is 0 - Dec is 11

        for (const week of monthDays) {

          for (const classDay of classDays) {

            //This forces to only consider class days
            const day = week[classDay];

            if (day !== 0) {

              //Build dateKey to find date
              let dateKey = buildDateString(day, month, 18)

              //If it does not exist, create it
              if (!classroom.schedules[dateKey]) {
                classroom.schedules[dateKey] = [];
              }

              //If the start and end month are the same
              if (startDate[1] === endDate[1]) {
                if (startDate[0] <= day && day <= endDate[0]) {

                  classroom.schedules[dateKey].push({
                    start: schedule.time_ini,
                    end: schedule.time_fin,
                    NRC: course.nrc
                  });
                }
              }
              //If not, on the first month, day should be bigger than the start day in order to consider it
              else if (month === startDate[1] && day >= startDate[0]) {

                classroom.schedules[dateKey].push({
                  start: schedule.time_ini,
                  end: schedule.time_fin,
                  NRC: course.nrc
                });

              }
              //Same for the last month (do not consider days after the course has ended)
              else if (month === endDate[1] && day <= endDate[0]) {

                classroom.schedules[dateKey].push({
                  start: schedule.time_ini,
                  end: schedule.time_fin,
                  NRC: course.nrc
                });

              }
              //Intermediate month, no restrictions
              else if (month !== startDate[1] && month !== endDate[1]) {

                classroom.schedules[dateKey].push({
                  start: schedule.time_ini,
                  end: schedule.time_fin,
                  NRC: course.nrc
                });

              }
            }

          }

        }

      }

    }
  }
}

//Execution: 
extractClassrooms(courses);
extractClassrooms(courses8A);
extractClassrooms(courses8B);
extractClassrooms(coursesMED);

fs.writeFile('results.json', JSON.stringify(classrooms, null, 2), err => {
  if (err) console.log(err);
  else console.log("Finished");
});

fs.writeFile('results.min.json', JSON.stringify(classrooms), err => {
  if (err) console.log(err);
  else console.log("Finished");
});
