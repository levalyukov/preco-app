import '../styles/Schedule.css';
import { useRef, useEffect, useState } from 'react';

function Schedule() {
	const [scheduleData, setSchedule] = useState<ScheduleStruct>({});
	const [scheduleLoaded, setScheduleLoading] = useState(false);
	const [scheduleError, setScheduleError] = useState(false);
	const [scheduleVisible, setScheduleVisible] = useState(false);
	const [weekCurrent, setCurrentWeek] = useState("");

	const [eduGroup, setEduGroup] = useState<EduGroup>({});
	const [groupSelected, setGroup] = useState<String>("100");
	const [groupHeaderSelected, setHeaderGroup] = useState<String>("100");
	const groupList = useRef<HTMLSelectElement>(null);

	const [loaded, setLoading] = useState(true);
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
	};

	interface EduGroup {
		[groups:string]: {array:Array<String>}
	};

	async function getCurrentWeek() {
		try {
			const connect = await fetch("http://localhost:3000/api/current_date");
			const data = await connect.json();
			setCurrentWeek(data.current);
		} catch {
			setCurrentWeek("");
		}
	}

	function groupChanged(event: React.ChangeEvent<HTMLSelectElement>) {
		setGroup(event.target.value);
	}

	useEffect(() => {
		document.title = "PrecoApp: Расписание";
		
		if (localStorage.getItem("user_quick_schedule") != null) {
			setGroup(String(localStorage.getItem("user_quick_schedule")));
			getScheduleData(String(localStorage.getItem("user_quick_schedule")));
			getCurrentWeek();
		};

		async function loadingSchedule() {
			try {
        const storedGroups = localStorage.getItem("grops");
        if (storedGroups) {
          const parsedGroups:EduGroup = JSON.parse(storedGroups);
          setEduGroup(parsedGroups);
        } else {
          const allEduGroups = await fetch("http://localhost:3000/api/groups");
          const groups: EduGroup = await allEduGroups.json();
          setEduGroup(groups);
          localStorage.setItem("grops", JSON.stringify(groups));
        }
			} catch (err) {
				console.error(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		}
		loadingSchedule();
		getCurrentWeek();
	}, [])

	async function getScheduleData(current_group:string) {
		const scheduleData = localStorage.getItem(current_group);
		setScheduleVisible(false);
		setScheduleLoading(true);
		try {
			let parseData;
			if (scheduleData) {
				parseData = JSON.parse(scheduleData);
			}

			if (parseData) {
				if (parseData.saved_datetime == weekCurrent) {
					setSchedule(parseData.saved_schedule);
					setHeaderGroup(current_group);
					setScheduleVisible(true);
					setScheduleError(false);
					setScheduleLoading(false);
				} 
			} else {
				setGroup(current_group);
				const server = await fetch("http://localhost:3000/api/schedule?group="+current_group);
				const scheduleData = await server.json();
				setSchedule(scheduleData);
				setHeaderGroup(current_group);
				setScheduleVisible(true);
				setScheduleError(false);
				setScheduleLoading(true);

				const data = {
					saved_schedule: scheduleData,
					saved_datetime: weekCurrent
				};

				localStorage.setItem(current_group, JSON.stringify(data));
			}
		} catch (err) {
			console.log(err);
			setScheduleError(true);
		} finally {
			setScheduleLoading(false);
		}
	}

	function controlPanel() {
		return (
			<div id='controlPanel'>
				<nav>
					<p>Учебная группа:</p>
					<select ref={groupList} value={String(groupSelected)} onChange={groupChanged}>
						{Object.entries(eduGroup.groups).map(([_index, _group]) => (
							<option>{_group}</option>
						))}
					</select>
				</nav>

				<button onClick={() => {getScheduleData(String(groupList?.current?.value)); }}>Получить расписание</button>
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
					<button onClick={() => {getScheduleData(String(groupList?.current?.value));}}>Повторить попытку</button>
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
					<h1>Расписание {groupHeaderSelected} <p id='scheduleDate'>{weekCurrent}</p></h1>
					{getSchedule()}
				</>
			) : (<></>)}
		</main>
  )
}

export { Schedule }
