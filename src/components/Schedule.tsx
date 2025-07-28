import '../styles/Schedule.css'
import { useRef, useEffect, useState } from 'react';

function Schedule() {
	const [scheduleData, setSchedule] = useState<ScheduleStruct>({})
	const [scheduleLoaded, setScheduleLoading] = useState(!true)
	const [scheduleError, setScheduleError] = useState(false)
	const [scheduleVisible, setScheduleVisible] = useState(false)

	const [eduGroup, setEduGroup] = useState<EduGroup>({})
	const [groupSelected, setGroup] = useState<String>("100");
	const groupList = useRef<HTMLSelectElement>(null)

	const [loaded, setLoading] = useState(true)
	const [error, setError] = useState(false)

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

	interface EduGroup {
		[groups:string]: {array:Array<String>}
	}

	useEffect(() => {
		document.title = "PrecoApp: Расписание";
		async function loadingSchedule() {
			try {
				const allEduGroups = await fetch("http://192.168.31.143:3000/groups")
				const groups = await allEduGroups.json()
				setEduGroup(groups)
			} catch (err) {
				console.error(err)
				setError(true)
			} finally {
				setLoading(false)
			}
		}; loadingSchedule()
	}, [])

	async function getScheduleData() {
		try {
			setScheduleLoading(true)
			const current_group = String(groupList?.current?.value)
			setGroup(current_group)
			setScheduleVisible(false)
			const server = await fetch("http://192.168.31.143:3000/schedule?group="+current_group)
			const schedule = await server.json()
			setSchedule(schedule)
			setScheduleVisible(true)
			setScheduleError(false)
		} catch (err) {
			setScheduleError(true)
		} finally {
			setScheduleLoading(false)
		}
	}

	function controlPanel() {
		return (
			<div id='controlPanel'>
				<nav>
					<p>Учебная группа:</p>
					<select ref={groupList}>
						{Object.entries(eduGroup.groups).map(([_index, _group]) => (
							<option>{_group}</option>
						))}
					</select>
				</nav>

				<button onClick={getScheduleData}>Получить расписание</button>
			</div>
		)
	}

	function getSchedule() {
		if (Object.keys(scheduleData).length === 0) {
			return (
				<section id="notice">
					<p>Расписания нет.</p>
				</section>
			)
		}

		return (
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
		)
	}

	function getScheduleState() {
		if (scheduleLoaded) {
			return (
				<section id='notice'><p>Загрузка расписания...</p></section>
			)
		}
		if (scheduleError) {
			return (
				<section id='notice'>
					<p>Ошибка подключения к серверу.</p>
					<button onClick={getScheduleData}>Повторить попытку</button>
				</section>
			)
		}
	}

	if (loaded) {
		return (
			<main id='schedule'>
				<section id="notice">
					<p>Подключение к серверу...</p>
				</section>
			</main>
		)
	}

	if (error) {
		return (
			<main id='schedule'>
				<section id="notice">
					<p>Ошибка подключения к серверу.</p>
					<button onClick={() => window.location.reload()}>Повторить попытку</button>
				</section>
			</main>
		)
	}

  return (
    <main id='schedule'>
			{controlPanel()}
			{getScheduleState()}
			{scheduleVisible ? (
				<>
					<h1>Расписание {groupSelected}</h1>
					{getSchedule()}
				</>
			) : (<></>)}
		</main>
  )
}

export { Schedule }