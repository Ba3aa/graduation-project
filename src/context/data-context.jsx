import React, { createContext, useState, useContext, useEffect } from "react";

// 1. إنشاء الكونتيكست
const DataContext = createContext();

// 2. مزود البيانات (المخزن)
export const DataProvider = ({ children }) => {
  // --- تحميل البيانات من LocalStorage أو استخدام بيانات وهمية أول مرة ---
  const [trainers, setTrainers] = useState(() => {
    const saved = localStorage.getItem("trainers");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            universityId: "2024001",
            firstName: "Ahmad",
            lastName: "Ali",
            email: "ahmad@school.edu",
            phone: "0790000001",
          },
          {
            id: 2,
            universityId: "2024002",
            firstName: "Sara",
            lastName: "Mousa",
            email: "sara@school.edu",
            phone: "0790000002",
          },
          {
            id: 3,
            universityId: "2024003",
            firstName: "Khaled",
            lastName: "Omar",
            email: "khaled@school.edu",
            phone: "0790000003",
          },
          {
            id: 4,
            universityId: "2024004",
            firstName: "Yousef",
            lastName: "Salem",
            email: "yousef@school.edu",
            phone: "0790000004",
          },
          {
            id: 5,
            universityId: "2024005",
            firstName: "Noor",
            lastName: "Hassan",
            email: "noor@school.edu",
            phone: "0790000005",
          },
          {
            id: 6,
            universityId: "2024006",
            firstName: "Layla",
            lastName: "Fadi",
            email: "layla@school.edu",
            phone: "0790000006",
          },
          {
            id: 7,
            universityId: "2024007",
            firstName: "Omar",
            lastName: "Khaled",
            email: "omar@school.edu",
            phone: "0790000007",
          },
        ];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved
      ? JSON.parse(saved)
      : [{ id: 101, name: "React Basics", level: "Beginner", duration: "40" }];
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("sessions");
    return saved ? JSON.parse(saved) : [];
  });

  // بيانات المخطط البياني الوهمية (Mock Data)
  const chartData = [
    { date: "2024-04-01", score: 85, trainers: 22 },
    { date: "2024-04-02", score: 88, trainers: 25 },
    { date: "2024-04-03", score: 92, trainers: 20 },
    { date: "2024-04-04", score: 78, trainers: 28 },
    { date: "2024-04-05", score: 95, trainers: 30 },
    { date: "2024-04-06", score: 82, trainers: 24 },
    { date: "2024-04-07", score: 89, trainers: 18 },
    { date: "2024-04-08", score: 91, trainers: 26 },
    { date: "2024-04-09", score: 75, trainers: 15 },
    { date: "2024-04-10", score: 84, trainers: 22 },
    { date: "2024-04-11", score: 93, trainers: 32 },
    { date: "2024-04-12", score: 87, trainers: 27 },
    { date: "2024-04-13", score: 90, trainers: 29 },
    { date: "2024-04-14", score: 81, trainers: 19 },
    { date: "2024-04-15", score: 86, trainers: 23 },
    { date: "2024-04-16", score: 88, trainers: 25 },
    { date: "2024-04-17", score: 94, trainers: 35 },
    { date: "2024-04-18", score: 92, trainers: 31 },
    { date: "2024-04-19", score: 85, trainers: 24 },
    { date: "2024-04-20", score: 79, trainers: 16 },
    { date: "2024-04-21", score: 83, trainers: 20 },
    { date: "2024-04-22", score: 87, trainers: 22 },
    { date: "2024-04-23", score: 80, trainers: 18 },
    { date: "2024-04-24", score: 91, trainers: 28 },
    { date: "2024-04-25", score: 89, trainers: 26 },
    { date: "2024-04-26", score: 76, trainers: 14 },
    { date: "2024-04-27", score: 93, trainers: 33 },
    { date: "2024-04-28", score: 82, trainers: 21 },
    { date: "2024-04-29", score: 88, trainers: 25 },
    { date: "2024-04-30", score: 95, trainers: 38 },
    { date: "2024-05-01", score: 84, trainers: 20 },
    { date: "2024-05-02", score: 90, trainers: 27 },
    { date: "2024-05-03", score: 86, trainers: 23 },
    { date: "2024-05-04", score: 92, trainers: 30 },
    { date: "2024-05-05", score: 94, trainers: 34 },
    { date: "2024-05-06", score: 96, trainers: 40 },
    { date: "2024-05-07", score: 89, trainers: 29 },
    { date: "2024-05-08", score: 77, trainers: 15 },
    { date: "2024-05-09", score: 83, trainers: 21 },
    { date: "2024-05-10", score: 88, trainers: 26 },
    { date: "2024-05-11", score: 91, trainers: 28 },
    { date: "2024-05-12", score: 85, trainers: 22 },
    { date: "2024-05-13", score: 82, trainers: 18 },
    { date: "2024-05-14", score: 95, trainers: 36 },
    { date: "2024-05-15", score: 93, trainers: 33 },
    { date: "2024-05-16", score: 87, trainers: 25 },
    { date: "2024-05-17", score: 94, trainers: 37 },
    { date: "2024-05-18", score: 90, trainers: 30 },
    { date: "2024-05-19", score: 84, trainers: 21 },
    { date: "2024-05-20", score: 81, trainers: 19 },
    { date: "2024-05-21", score: 75, trainers: 12 },
    { date: "2024-05-22", score: 74, trainers: 10 },
    { date: "2024-05-23", score: 86, trainers: 24 },
    { date: "2024-05-24", score: 89, trainers: 27 },
    { date: "2024-05-25", score: 83, trainers: 20 },
    { date: "2024-05-26", score: 85, trainers: 22 },
    { date: "2024-05-27", score: 92, trainers: 34 },
    { date: "2024-05-28", score: 88, trainers: 26 },
    { date: "2024-05-29", score: 76, trainers: 13 },
    { date: "2024-05-30", score: 91, trainers: 29 },
    { date: "2024-05-31", score: 84, trainers: 21 },
    { date: "2024-06-01", score: 85, trainers: 20 },
    { date: "2024-06-02", score: 94, trainers: 35 },
    { date: "2024-06-03", score: 78, trainers: 15 },
    { date: "2024-06-04", score: 93, trainers: 33 },
    { date: "2024-06-05", score: 75, trainers: 12 },
    { date: "2024-06-06", score: 89, trainers: 26 },
    { date: "2024-06-07", score: 90, trainers: 28 },
    { date: "2024-06-08", score: 92, trainers: 31 },
    { date: "2024-06-09", score: 95, trainers: 36 },
    { date: "2024-06-10", score: 82, trainers: 18 },
    { date: "2024-06-11", score: 79, trainers: 16 },
    { date: "2024-06-12", score: 96, trainers: 39 },
    { date: "2024-06-13", score: 77, trainers: 14 },
    { date: "2024-06-14", score: 93, trainers: 32 },
    { date: "2024-06-15", score: 88, trainers: 27 },
    { date: "2024-06-16", score: 91, trainers: 30 },
    { date: "2024-06-17", score: 97, trainers: 41 },
    { date: "2024-06-18", score: 80, trainers: 17 },
    { date: "2024-06-19", score: 89, trainers: 25 },
    { date: "2024-06-20", score: 92, trainers: 33 },
    { date: "2024-06-21", score: 84, trainers: 20 },
    { date: "2024-06-22", score: 87, trainers: 24 },
    { date: "2024-06-23", score: 96, trainers: 38 },
    { date: "2024-06-24", score: 81, trainers: 18 },
    { date: "2024-06-25", score: 82, trainers: 19 },
    { date: "2024-06-26", score: 93, trainers: 34 },
    { date: "2024-06-27", score: 95, trainers: 37 },
    { date: "2024-06-28", score: 83, trainers: 20 },
    { date: "2024-06-29", score: 78, trainers: 15 },
    { date: "2024-06-30", score: 94, trainers: 35 },
  ];

  // --- حفظ أي تغيير فوراً في LocalStorage ---
  useEffect(() => {
    localStorage.setItem("trainers", JSON.stringify(trainers));
  }, [trainers]);
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Trainers
  const addTrainer = (trainer) =>
    setTrainers([...trainers, { ...trainer, id: Date.now() }]);
  const updateTrainer = (id, updated) =>
    setTrainers(trainers.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  const deleteTrainer = (id) =>
    setTrainers(trainers.filter((t) => t.id !== id));

  // Courses
  const addCourse = (course) =>
    setCourses([...courses, { ...course, id: Date.now() }]);
  const updateCourse = (id, updated) =>
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  const deleteCourse = (id) => setCourses(courses.filter((c) => c.id !== id));

  // Sessions
  const addSession = (session) =>
    setSessions([...sessions, { ...session, id: Date.now() }]);
  const deleteSession = (id) =>
    setSessions(sessions.filter((s) => s.id !== id));
  // AI reports
  

  return (
    <DataContext.Provider
      value={{
        trainers,
        setTrainers,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        courses,
        setCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        sessions,
        setSessions,
        addSession,
        deleteSession,
        chartData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
