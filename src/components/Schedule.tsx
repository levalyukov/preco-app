import '../styles/Schedule.css'
import { useEffect, useState } from 'react';

function Schedule() {
	const [scheduleData, setSchedule] = useState<ScheduleStruct>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	interface ScheduleStruct {
		[date:string]: {
			[index:number]: LessonStruct
		}
	}
	
	interface LessonStruct {
		name:string,
		coupe:string,
		time_start:string,
		time_end:string
	}

	useEffect(() => {
		document.title = "PrecoApp: Расписание";
		async function loadingSchedule() {
			try {
				const res = await fetch("http://192.168.31.143:3000/schedule")
				const data = await res.json()
				setSchedule(data)
				setError(false)
				setLoading(false)
			} catch (err) {
				console.error(err)
				setError(true)
				setLoading(false)
			}
		}; loadingSchedule()
	}, [])

	if (loading) return (
		<main id='schedule'>
			<section id='loading'>
				<p>Подключение к серверу...</p>
			</section>
		</main>
	)
	if (error) return (
		<main id='schedule'>
			<section id='error'>
				<p>Ошибка подключения к серверу.</p>
				<button onClick={() => window.location.reload()}>Повторить попытку</button>
			</section>
		</main>
	)
	
	if (Object.keys(scheduleData).length === 0) return (
		<main id='schedule'>
			<section id='error'>
				<p>Нет расписания.</p>
				<button onClick={() => window.location.reload()}>Повторить попытку</button>
			</section>
		</main>
	)

  return (
    <main id='schedule'>
			<h1>Расписание 110 группы</h1>
			<section id='render'>
				{Object.entries(scheduleData).map(([key, value]) => (
					<article className='current'>
						<p id='header'>{key}</p>
						<div id='data-container'>
							<table>
							{Object.entries(value).map(([index, lesson]) => (
								<>
  			    		  <tbody>
  			    		    <tr>
  			    		      <td>{index} пара <br /> {lesson.time_start} — {lesson.time_end}</td>
  			    		      <td>{lesson.name}</td>
  			    		    </tr>
  			    		  </tbody>
								</>
							))}
							</table>
						</div>
					</article>
				))}
			</section>
		</main>
  )
}

export { Schedule }