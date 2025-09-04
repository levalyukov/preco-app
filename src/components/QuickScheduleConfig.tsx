import '../styles/Config.css'
import { useEffect, useRef, useState } from 'react'

function QuickScheduleConfig() {
  const selectGroup = useRef<HTMLSelectElement>(null);
  const [quickScheduleReady, setQuickSchedule] = useState(false);
	const [eduGroup, setEduGroup] = useState<EduGroup>({});
  const [error, setErrorQS] = useState(!false);
	interface EduGroup {[groups:string]: {array:Array<String>}};

  useEffect(() => {
		async function loadingSchedule() {
			try {
				const allEduGroups = await fetch("http://localhost:3000/api/groups");
				const groups = await allEduGroups.json();
				setEduGroup(groups);
			} catch (err) {
				console.error(err);
        setErrorQS(true);
			} finally {
        setErrorQS(false);
      }
		}
    if (localStorage.getItem("user_quick_schedule") == null) {
      loadingSchedule();
    } else {
      setErrorQS(false);
      setQuickSchedule(true);
    }
  }, [])
  
  function saveQuickSchedule() {
    setQuickSchedule(true);
    if (selectGroup.current) {
      localStorage.setItem("user_quick_schedule", selectGroup.current.value)
    }
  }

  if (error) {
    return (<></>)
  }

  if (!quickScheduleReady) {
    return (
      <div id='background-cfg'>
        <div id='config'>
          <h1>Быстрое расписание</h1>
          <p>Выберите Вашу учебную группу из списка ниже чтобы быстрее получать расписание:</p>
          <select ref={selectGroup}>
						{Object.entries(eduGroup.groups).map(([_index, _group]) => (
							<option>{_group}</option>
						))}
          </select>
          <button onClick={saveQuickSchedule}>Сохранить</button>
        </div>
      </div>
    )
  } else {
    return (<></>)
  }
}

export { QuickScheduleConfig }