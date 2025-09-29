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
		};
	};
	
	interface LessonStruct {
		name:string,
		coupe:string,
		time_start:string,
		time_end:string
	};

	interface EduGroup {
		[groups:string]: {array:Array<String>}
	};

	function groupChanged(event: React.ChangeEvent<HTMLSelectElement>) {
		setGroup(event.target.value);
	};

	useEffect(() => {
		document.title = "PrecoApp: Расписание";
		
		getCurrentWeek();
		// todo: Add the string "loading..." in the future.
		setTimeout(() => {
			if (localStorage.getItem("user_quick_schedule") != null) {
				setGroup(String(localStorage.getItem("user_quick_schedule")));
				getScheduleData(String(localStorage.getItem("user_quick_schedule")));
			};
		}, 2000);

		async function loadingSchedule() {
			try {
        const storedGroups = localStorage.getItem("groups");
        if (storedGroups) {
          const parsedGroups:EduGroup = JSON.parse(storedGroups);
          setEduGroup(parsedGroups);
        } else {
          const data = await fetch("http://localhost:3000/api/groups");
          const groups = await data.json();
					setEduGroup(groups);
					localStorage.setItem("groups", JSON.stringify(groups));
        };
			} catch (err) {
				console.error(err);
				setError(true);
			} finally {
				setLoading(false);
			};
		};
		loadingSchedule();
	}, []);

	async function getScheduleData(current_group:string) {
		const scheduleData = localStorage.getItem(current_group);
		setScheduleVisible(false);
		setScheduleLoading(true);

		let parseData;
		if (scheduleData) parseData = JSON.parse(scheduleData);

		try {
			if (parseData) {
				if (parseData.saved_datetime == weekCurrent) {
					setSchedule(parseData.saved_schedule);
					setHeaderGroup(current_group);
					setScheduleVisible(true);
					setScheduleError(false);
					setScheduleLoading(false);
					console.log("Schedule is loaded.");
				} else {
					console.log("Schedule is parsed.");
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
				};
			} else {
				console.log("Schedule is parsed.");
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
			};
		} catch (err) {
			console.log(err);
			setScheduleError(true);
			setScheduleVisible(false);
		} finally {
			setScheduleVisible(true);
			setScheduleLoading(false);
		};
	};

	async function getCurrentWeek() {
		try {
			const connect = await fetch("http://localhost:3000/api/current_date");
			const data = await connect.json();
			setCurrentWeek(data.current);
		} catch (err) {
			console.error(err);
		};
	};

  function resetLocalStorage() {
      if (localStorage.getItem("user_quick_schedule") != null) {
          localStorage.removeItem("user_quick_schedule"); 
          window.location.reload();
      };
  };

	function controlPanel() {
		if (!eduGroup.groups) {return (<></>)};

		if (Object.keys(eduGroup.groups).length !== 0) {
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
					<button onClick={() => {getScheduleData(String(groupList?.current?.value));}}>Получить расписание</button><br/>
					<a className='changeGroup' onClick={resetLocalStorage}>Изменить учебную группу</a>
				</div>
			);
		};
	};

	function getSchedule() {
		if (Object.keys(scheduleData).length === 0) {
			return (
				<section id="notice">
					<p>Расписания нет.</p>
				</section>
			);
		};

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
		);
	};

	function getScheduleState() {
		if (scheduleLoaded) {
			return (
				<section id='notice'><p>Загрузка расписания...</p></section>
			);
		};

		if (scheduleError) {
			return (
				<section id='notice'>
					<p>Ошибка подключения к серверу.</p>
					<button onClick={() => {getScheduleData(String(groupList?.current?.value));}}>Повторить попытку</button>
				</section>
			);
		};
	};

	if (loaded) {
		return (
			<main id='schedule'>
				<section id="notice">
					<p>Подключение к серверу...</p>
				</section>
			</main>
		);
	};

	if (error) {
		return (
			<main id='schedule'>
				<section id="notice">
					<p>Ошибка подключения к серверу.</p>
					<button onClick={() => window.location.reload()}>Повторить попытку</button>
				</section>
			</main>
		);
	};

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
  );
};

export { Schedule };
