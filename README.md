# Attendance Logger
A simple web app with interactive layout run on javascript, powered by Firebase real-time database. The app allows one to add their attendance status for any particular day for the courses they have registered. Additionally, the app has a section to display the percentage of the student's current attendance. Clicking on any of the bar/percentages will let the user access a detailed view of all the days of each month the classes for the particular course have been help and how many of them have been marked present or absent. One can also save short notes grouped by dates. Each user can access their attendance or notes through loggin in with their credentials.

Tapping on the listed courses will change the color of the course. The colors cycle through a total of three Default (No class) - Green (Attended) - Red (Absent). Further, upon the color of the course changing to green or red, a new input will appear to enter the number of classes held on that particular day. Clicking/Tapping on Add will push the entered attendance to the database. The database has a branch for each course. Each branch has a branch for every date a class is held for that course, in addition to a branch to store the present/total classes count. The date branches store the number of classes held and the number of classes attended on that day. Clicking on log will refresh and display the new attendance statistics. The database's rules are written such that anyone can view the content, but writing access is only limited to authenticated users, making the add attendance feature restricted to only those with access.

An instance of this web app is hosted on netlify:
https://attentaskcal.netlify.app/

An older version can be found here:
https://atten-cal-s24.netlify.app/

# Screenshots
### Login page
![Image](screenshots/login.png)

### After login
![Image](screenshots/afterlogin.png)

### Adding attendance
![Image](screenshots/adding_attendance.png)

### Adding attendance
![Image](screenshots/adding_attendance.png)

### Updated attendance
![Image](screenshots/updated_stats.png)

### Adding notes
![Image](screenshots/adding_notes.png)

### Updated notes
![Image](screenshots/viewing_notes.png)
