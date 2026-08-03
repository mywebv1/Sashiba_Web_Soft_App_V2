@echo off
echo Starting local preview server for Attendance Tracker Dashboard...
start "" "http://localhost:8081"
npx --yes http-server "D:/Web_Backup/From Figma/AttendanceTrackerDashboard-main/Web_Ready" -p 8081 -c-1 --open
