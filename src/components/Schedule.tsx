import React from 'react';
import '../styles/Schedule.css'

const Schedule: React.FC = () => {
    enum LessonType { LESSON = "", EXAM = ", Экзамен" }

    interface Lesson {
        type: LessonType,
        name: string,
        teacher: string,
        auditorium: number,
        lesson_start: string,
        lesson_end: string
    };
        
    interface DaySchedule {
        date: string,
        sctruct: { [key:number]: Lesson }
    };

    const scheduleRender = () => {
        const schedule: {[key: number]: DaySchedule } = {
            0: {
                date: '07.06.2025',
                sctruct: {
                    1: {
                        type: LessonType.LESSON,
                        name: 'География',
                        teacher: 'Пашкевич Л.В.',
                        auditorium: 308,
                        lesson_start: '8:30',
                        lesson_end: '10:00'
                    },
                    2: {
                        type: LessonType.LESSON,
                        name: 'История',
                        teacher: 'Панова Л.В.',
                        auditorium: 401,
                        lesson_start: '10:10',
                        lesson_end: '11:40'
                    }
                }
            },
            1: {
                date: '08.06.2025',
                sctruct: {
                    1: {
                        type: LessonType.EXAM,
                        name: 'Физика',
                        teacher: 'Волкова К.В.',
                        auditorium: 108,
                        lesson_start: '8:30',
                        lesson_end: '10:00'
                    }
                }
            },
            2: {
                date: '08.06.2025',
                sctruct: {
                    1: {
                        type: LessonType.EXAM,
                        name: 'Физика',
                        teacher: 'Волкова К.В.',
                        auditorium: 108,
                        lesson_start: '8:30',
                        lesson_end: '10:00'
                    },
                    2: {
                        type: LessonType.EXAM,
                        name: 'История',
                        teacher: 'Панова Л.В.',
                        auditorium: 110,
                        lesson_start: '10:10',
                        lesson_end: '11:40'
                    }
                }
            },
            3: {
                date: '07.06.2025',
                sctruct: {
                    1: {
                        type: LessonType.LESSON,
                        name: 'География',
                        teacher: 'Пашкевич Л.В.',
                        auditorium: 308,
                        lesson_start: '8:30',
                        lesson_end: '10:00'
                    },
                    2: {
                        type: LessonType.LESSON,
                        name: 'История',
                        teacher: 'Панова Л.В.',
                        auditorium: 401,
                        lesson_start: '10:10',
                        lesson_end: '11:40'
                    }
                }
            },
            4: {
                date: '08.06.2025',
                sctruct: {
                    1: {
                        type: LessonType.EXAM,
                        name: 'Физика',
                        teacher: 'Волкова К.В.',
                        auditorium: 108,
                        lesson_start: '8:30',
                        lesson_end: '10:00'
                    }
                }
            },
            5: {
                date: '08.06.2025',
                sctruct: {
                    1: {
                        type: LessonType.EXAM,
                        name: 'Физика',
                        teacher: 'Волкова К.В.',
                        auditorium: 108,
                        lesson_start: '8:30',
                        lesson_end: '10:00'
                    },
                    2: {
                        type: LessonType.EXAM,
                        name: 'История',
                        teacher: 'Панова Л.В.',
                        auditorium: 110,
                        lesson_start: '10:10',
                        lesson_end: '11:40'
                    }
                }
            }
        };

        const renderSchedule = () => {
            return Object.entries(schedule).map(([key, value]) => (
                <div>
                    <article>
                        <p id='header'>{value.date}</p>
                        <div id='data-container'>
                        {Object.entries(value.sctruct).map(([lessonKey, lesson]) => (
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{lessonKey} пара</td>
                                        <td>{lesson.name}{lesson.type}</td>
                                    </tr>
                                </tbody>

                                <tbody>
                                    <tr>
                                        <td>{lesson.lesson_start} — {lesson.lesson_end}</td>
                                        <td>{lesson.teacher} {lesson.auditorium} КБ</td>
                                    </tr>
                                </tbody>
                            </table>
                        ))}
                        </div>
                    </article>
                </div>
            ));
        }

        return <div id='schedule-container'>{renderSchedule()}</div>
    }

    return (
        scheduleRender()
    );
}

export default Schedule;
