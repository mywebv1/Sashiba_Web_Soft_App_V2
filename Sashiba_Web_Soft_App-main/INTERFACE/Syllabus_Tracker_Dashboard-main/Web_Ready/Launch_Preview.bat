@echo off
echo Starting local preview server for CurriculumOS Syllabus Tracker Dashboard...
start "" "http://localhost:8080"
npx --yes http-server "D:/Web_Backup/From Figma/Syllabus_Tracker_Dashboard-main/Web_Ready" -p 8080 -c-1 --open
